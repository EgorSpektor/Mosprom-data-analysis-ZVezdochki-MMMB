from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.sql import func
from database import Base

class DataFile(Base):
    """Модель для хранения информации о загруженных файлах"""
    __tablename__ = "data_files"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
    original_name = Column(String)
    file_size = Column(Integer)
    file_type = Column(String)  # csv, xlsx, json
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    processed = Column(Boolean, default=False)
    rows_count = Column(Integer)
    columns_count = Column(Integer)
    description = Column(Text)

class AnalysisJob(Base):
    """Модель для хранения задач анализа"""
    __tablename__ = "analysis_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, index=True)
    job_type = Column(String)  # basic, advanced, custom
    status = Column(String, default="pending")  # pending, running, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    result_data = Column(Text)  # JSON результат
    error_message = Column(Text)

class DataMetrics(Base):
    """Модель для хранения метрик данных"""
    __tablename__ = "data_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, index=True)
    metric_name = Column(String)
    metric_value = Column(Float)
    metric_type = Column(String)  # count, mean, std, min, max, etc.
    column_name = Column(String)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())