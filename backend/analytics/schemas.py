from pydantic import BaseModel
from typing import Dict, Any

class AnalysisResult(BaseModel):
    summary: Dict[str, Any]
    statistics: Dict[str, Any]