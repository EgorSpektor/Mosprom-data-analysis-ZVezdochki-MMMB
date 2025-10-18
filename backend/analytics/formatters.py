# backend/analytics/formatters.py

from typing import Optional

def format_currency(value: Optional[float]) -> str:
    """Форматирование денежных значений"""
    if value is None:
        return "—"
    if value >= 1_000_000:
        return f"{value/1_000_000:.1f} млн"
    return f"{value:,.0f}"

def format_percentage(value: Optional[float]) -> str:
    """Форматирование процентных значений"""
    if value is None:
        return "—"
    return f"{value:.1f}%"