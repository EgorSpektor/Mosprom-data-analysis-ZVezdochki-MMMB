from sqlalchemy import Column, Float
from database import Base

class Tax(Base):
    __tablename__ = "tax"
    value = Column(Float, nullable=False)