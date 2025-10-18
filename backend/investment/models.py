from sqlalchemy import Column, Float
from database import Base

class Investment(Base):
    __tablename__ = "investments"
    value = Column(Float, nullable=False)
