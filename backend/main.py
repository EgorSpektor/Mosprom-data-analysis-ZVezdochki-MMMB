from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from typing import List, Dict, Any
import os
import json
from datetime import datetime
from sqlalchemy.orm import Session
from database import get_db, get_clickhouse_client, engine
from models import Base, DataFile, AnalysisJob, DataMetrics
import uuid

app = FastAPI(
    title="Mosprom Data Analysis API",
    description="API для анализа данных Mosprom с поддержкой PostgreSQL и ClickHouse",
    version="1.0.0"
)

# Создание таблиц при запуске
Base.metadata.create_all(bind=engine)

# CORS middleware для работы с React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели данных
class DataUpload(BaseModel):
    filename: str
    data: List[Dict[str, Any]]

class AnalysisResult(BaseModel):
    summary: Dict[str, Any]
    statistics: Dict[str, Any]

@app.get("/")
async def root():
    return {"message": "Mosprom Data Analysis API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/data/files")
async def list_data_files():
    """Получить список доступных файлов данных"""
    data_dir = "../data"
    if not os.path.exists(data_dir):
        return {"files": []}
    
    files = [f for f in os.listdir(data_dir) if f.endswith(('.csv', '.xlsx', '.json'))]
    return {"files": files}

@app.get("/api/data/{filename}")
async def get_data_preview(filename: str, limit: int = 100):
    """Получить превью данных из файла"""
    try:
        file_path = f"../data/{filename}"
        
        if filename.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif filename.endswith('.xlsx'):
            df = pd.read_excel(file_path)
        else:
            raise HTTPException(status_code=400, detail="Неподдерживаемый формат файла")
        
        # Базовая информация о датасете
        info = {
            "shape": df.shape,
            "columns": df.columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "missing_values": df.isnull().sum().to_dict()
        }
        
        # Превью данных
        preview = df.head(limit).to_dict('records')
        
        return {
            "info": info,
            "preview": preview
        }
    
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Файл не найден")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обработки файла: {str(e)}")

@app.post("/api/analysis/basic")
async def basic_analysis(data: DataUpload, db: Session = Depends(get_db)):
    """Базовый анализ данных с сохранением в базы данных"""
    start_time = datetime.now()
    
    try:
        df = pd.DataFrame(data.data)
        
        # Создание записи о задаче анализа
        analysis_job = AnalysisJob(
            file_id=0,  # Временно, пока не реализована загрузка файлов
            job_type="basic",
            status="running"
        )
        db.add(analysis_job)
        db.commit()
        db.refresh(analysis_job)
        
        # Описательная статистика
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        statistics = {}
        
        if len(numeric_cols) > 0:
            statistics = df[numeric_cols].describe().to_dict()
            
            # Сохранение метрик в PostgreSQL
            for col in numeric_cols:
                col_stats = df[col].describe()
                for stat_name, stat_value in col_stats.items():
                    metric = DataMetrics(
                        file_id=0,
                        metric_name=stat_name,
                        metric_value=float(stat_value),
                        metric_type="descriptive",
                        column_name=col
                    )
                    db.add(metric)
        
        # Общая информация
        summary = {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "numeric_columns": len(numeric_cols),
            "categorical_columns": len(df.columns) - len(numeric_cols),
            "missing_values_total": int(df.isnull().sum().sum()),
            "memory_usage": int(df.memory_usage(deep=True).sum())
        }
        
        # Обновление статуса задачи
        analysis_job.status = "completed"
        analysis_job.completed_at = datetime.now()
        analysis_job.result_data = json.dumps({"summary": summary, "statistics": statistics})
        
        db.commit()
        
        # Логирование в ClickHouse
        try:
            ch_client = get_clickhouse_client()
            execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
            
            ch_client.insert('analysis_events', [{
                'event_id': str(uuid.uuid4()),
                'timestamp': datetime.now(),
                'user_id': 'anonymous',
                'file_name': data.filename,
                'analysis_type': 'basic',
                'execution_time_ms': execution_time,
                'rows_processed': len(df),
                'columns_processed': len(df.columns),
                'success': True,
                'error_message': ''
            }])
            
            # Сохранение результатов анализа в ClickHouse
            for col in numeric_cols:
                col_stats = df[col].describe()
                for stat_name, stat_value in col_stats.items():
                    ch_client.insert('analysis_results', [{
                        'result_id': str(uuid.uuid4()),
                        'timestamp': datetime.now(),
                        'file_name': data.filename,
                        'column_name': col,
                        'statistic_type': stat_name,
                        'statistic_value': float(stat_value),
                        'data_type': 'numeric'
                    }])
                    
        except Exception as ch_error:
            print(f"ClickHouse logging error: {ch_error}")
        
        return AnalysisResult(summary=summary, statistics=statistics)
    
    except Exception as e:
        # Обновление статуса задачи при ошибке
        if 'analysis_job' in locals():
            analysis_job.status = "failed"
            analysis_job.error_message = str(e)
            analysis_job.completed_at = datetime.now()
            db.commit()
        
        # Логирование ошибки в ClickHouse
        try:
            ch_client = get_clickhouse_client()
            execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
            
            ch_client.insert('analysis_events', [{
                'event_id': str(uuid.uuid4()),
                'timestamp': datetime.now(),
                'user_id': 'anonymous',
                'file_name': data.filename,
                'analysis_type': 'basic',
                'execution_time_ms': execution_time,
                'rows_processed': 0,
                'columns_processed': 0,
                'success': False,
                'error_message': str(e)
            }])
        except Exception as ch_error:
            print(f"ClickHouse error logging failed: {ch_error}")
        
        raise HTTPException(status_code=500, detail=f"Ошибка анализа: {str(e)}")

@app.get("/api/analytics/events")
async def get_analysis_events(limit: int = 100):
    """Получить события анализа из ClickHouse"""
    try:
        ch_client = get_clickhouse_client()
        query = f"""
        SELECT * FROM analysis_events 
        ORDER BY timestamp DESC 
        LIMIT {limit}
        """
        result = ch_client.query(query)
        return {"events": result.result_rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения событий: {str(e)}")

@app.get("/api/analytics/performance")
async def get_performance_metrics(hours: int = 24):
    """Получить метрики производительности за последние N часов"""
    try:
        ch_client = get_clickhouse_client()
        query = f"""
        SELECT 
            toStartOfHour(timestamp) as hour,
            avg(execution_time_ms) as avg_execution_time,
            count() as total_analyses,
            sum(case when success = 1 then 1 else 0 end) as successful_analyses
        FROM analysis_events 
        WHERE timestamp >= now() - INTERVAL {hours} HOUR
        GROUP BY hour
        ORDER BY hour DESC
        """
        result = ch_client.query(query)
        return {"metrics": result.result_rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения метрик: {str(e)}")

@app.get("/api/jobs")
async def get_analysis_jobs(db: Session = Depends(get_db), limit: int = 50):
    """Получить список задач анализа из PostgreSQL"""
    jobs = db.query(AnalysisJob).order_by(AnalysisJob.created_at.desc()).limit(limit).all()
    return {"jobs": jobs}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)