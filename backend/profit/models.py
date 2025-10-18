from sqlalchemy import Column, Float
from database import Base


class Profit(Base):
    __tablename__ = "profits"
    value = Column(Float, nullable=False)