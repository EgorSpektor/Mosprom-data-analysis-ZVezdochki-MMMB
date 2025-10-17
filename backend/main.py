from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine
from models import Base
from analytics.router import AnalysisJob
from analytics.router import router as anal_router
from data.router import router as data_router

app = FastAPI(
    title="Mosprom Data Analysis API",
    description="API для анализа данных Mosprоm с поддержкой PostgreSQL и ClickHouse",
    version="1.0.0"
)

app.include_router(anal_router)
app.include_router(data_router)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Mosprom Data Analysis API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/jobs")
async def get_analysis_jobs(db: Session = Depends(get_db), limit: int = 50):
    """Получить список задач анализа из PostgreSQL"""
    jobs = db.query(AnalysisJob).order_by(AnalysisJob.created_at.desc()).limit(limit).all()
    return {"jobs": jobs}

