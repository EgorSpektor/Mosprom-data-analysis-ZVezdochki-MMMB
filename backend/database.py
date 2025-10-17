from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from settings import settings
from sqlalchemy.ext.declarative import declarative_base

async def get_db():
    """Получить сессию PostgreSQL"""
    db = async_session_maker()
    try:
        yield db
    finally:
        await db.close()


Base = declarative_base()
engine = create_async_engine(settings.DATABASE_URL)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

