# backend/analytics/financial_analysis.py

from typing import Dict, Optional
from ..database import DatabaseClient, DatabaseResult

def calculate_growth(current: Optional[float], previous: Optional[float]) -> Optional[float]:
    """Расчёт процентного роста между периодами"""
    if current is None or previous is None or previous == 0:
        return None
    return ((current - previous) / previous) * 100

def determine_trend(growth: Optional[float], threshold: float = 2.0) -> str:
    """Определение тренда на основе роста"""
    if growth is None:
        return 'stable'
    if growth > threshold:
        return 'up'
    elif growth < -threshold:
        return 'down'
    return 'stable'

class FinancialAnalyzer:
    """Анализатор финансовых данных"""
    
    def __init__(self, db_client: DatabaseClient):
        self.db = db_client
    
    def get_key_metrics_sql(self, years: Tuple[int, int] = (2020, 2024)) -> Dict:
        # ... реализация из предыдущего кода
        pass
    
    def get_financial_ratios_sql(self) -> Dict:
        # ... реализация из предыдущего кода  
        pass
      