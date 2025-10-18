from fastapi import APIRouter, HTTPException, Depends
import pandas as pd
import os


router = APIRouter(
    prefix="/data",
    tags=["Данные"]
)


@router.get("/api/data/files")
async def list_data_files():
    """Получить список доступных файлов данных"""
    data_dir = "../data"
    if not os.path.exists(data_dir):
        return {"files": []}
    
    files = [f for f in os.listdir(data_dir) if f.endswith(('.csv', '.xlsx', '.json'))]
    return {"files": files}

@router.get("/api/data/{filename}")
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