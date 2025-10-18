from logging.config import fileConfig
import os
from database import Base

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context
from adress.models import Adress
from company.models import Company
from investment.models import Investment
from profit.models import Profit
from revenue.models import Revenue
from staff.models import Staff
from tax.models import Tax


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config
config.set_main_option(
    "sqlalchemy.url", os.getenv("DATABASE_URL", "postgresql+asyncpg://mosprom_user:mosprom_password@localhost:5432/mosprom_data")
)
# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # If the URL is an async URL (asyncpg), use an AsyncEngine and run
    # migrations inside an asyncio event loop. Otherwise fall back to the
    # traditional synchronous engine_from_config path.
    url = config.get_main_option("sqlalchemy.url")
    if url and ("asyncpg" in url or url.startswith("postgresql+asyncpg")):
        connectable = create_async_engine(
            url,
            poolclass=pool.NullPool,
        )

        # define the sync runner that Alembic expects
        def run_migrations(connection):
            context.configure(connection=connection, target_metadata=target_metadata)
            with context.begin_transaction():
                context.run_migrations()

        import asyncio

        async def do_run():
            async with connectable.connect() as connection:
                # run the migration functions in a sync context using run_sync
                await connection.run_sync(run_migrations)

        asyncio.run(do_run())
    else:
        connectable = engine_from_config(
            config.get_section(config.config_ini_section, {}),
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
        )

        with connectable.connect() as connection:
            context.configure(
                connection=connection, target_metadata=target_metadata
            )

            with context.begin_transaction():
                context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
