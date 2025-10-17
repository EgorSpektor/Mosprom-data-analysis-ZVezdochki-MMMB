import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import clickhouse_connect

# PostgreSQL конфигурация
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://mosprom_user:mosprom_password@localhost:5432/mosprom_data")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ClickHouse конфигурация
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