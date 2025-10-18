from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_db, engine
from database import Base

from analytics.router import router as anal_router
from data.router import router as data_router
from company.router import router as company_router

app = FastAPI(
    title="Mosprom Data Analysis API",
    description="API для анализа данных Mosprоm с поддержкой PostgreSQL и ClickHouse",
    version="1.0.0"
)

app.include_router(anal_router)
app.include_router(data_router)
app.include_router(company_router)


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




