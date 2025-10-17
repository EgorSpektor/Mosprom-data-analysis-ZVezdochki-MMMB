from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from settings import settings
from sqlalchemy.ext.declarative import declarative_base
import clickhouse_connect


async def get_db():
    """Получить сессию PostgreSQL"""
    db = async_session_maker()
    try:
        yield db
    finally:
        await db.close()


def get_clickhouse_client():
    """Получить клиент ClickHouse"""
    return clickhouse_connect.get_client(
        host=settings.CLICKHOUSE_HOST,
        port=settings.CLICKHOUSE_PORT,
        username=settings.CLICKHOUSE_USER,
        password=settings.CLICKHOUSE_PASSWORD,
        database=settings.CLICKHOUSE_DB
    )

Base = declarative_base()
engine = create_async_engine(settings.DATABASE_URL)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

