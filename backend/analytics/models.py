from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.sql import func
from database import Base


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