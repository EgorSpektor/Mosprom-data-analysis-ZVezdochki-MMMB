from pydantic_settings import BaseSettings
from pydantic import root_validator


class Settings(BaseSettings):
    CLICKHOUSE_DB: str
    CLICKHOUSE_USER: str
    CLICKHOUSE_PASSWORD: str
    CLICKHOUSE_PORT: int
    CLICKHOUSE_HOST: str

    
    @root_validator(skip_on_failure=True)
    def get_databese_url(cls, v):
        v["DATABASE_URL"] =  (
        f"postgresql+asyncpg://{v['POSTGRES_USER']}:"
        f"{v['POSTGRES_PASSWORD']}@{v['POSTGRES_HOST']}:{v['POSTGRES_PORT']}/{v['POSTGRES_NAME']}"
    )
        return v


    class Confiq:
        env_file = ".env"

settings = Settings()
print(settings.DATABASE_URL)