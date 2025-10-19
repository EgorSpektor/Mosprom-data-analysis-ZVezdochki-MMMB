from pydantic import BaseModel
from typing import List, Dict, Any


class DataUpload(BaseModel):
    filename: str
    data: List[Dict[str, Any]]