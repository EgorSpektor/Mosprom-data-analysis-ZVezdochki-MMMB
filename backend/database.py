from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import clickhouse_connect

from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import as_declarative
import os
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import clickhouse_connect

# PostgreSQL конфигурация
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://mosprom_user:mosprom_password@localhost:5432/mosprom_data")
engine = create_async_engine(DATABASE_URL)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


CLICKHOUSE_HOST = os.getenv("CLICKHOUSE_HOST", "localhost")
CLICKHOUSE_PORT = int(os.getenv("CLICKHOUSE_PORT", "8123"))
CLICKHOUSE_USER = os.getenv("CLICKHOUSE_USER", "mosprom_user")
CLICKHOUSE_PASSWORD = os.getenv("CLICKHOUSE_PASSWORD", "mosprom_password")
CLICKHOUSE_DB = os.getenv("CLICKHOUSE_DB", "mosprom_analytics")

def get_clickhouse_client():
    """Получить клиент ClickHouse"""
    return clickhouse_connect.get_client(
        host=CLICKHOUSE_HOST,
        port=CLICKHOUSE_PORT,
        username=CLICKHOUSE_USER,
        password=CLICKHOUSE_PASSWORD,
        database=CLICKHOUSE_DB
    )

def get_db():
    """Получить сессию PostgreSQL"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Метаданные для работы с таблицами
metadata = MetaData()



@as_declarative()
class Base:
    id = Column(
        Integer,
        primary_key=True,
    )





