from sqlalchemy import Column, Float
from database import Base


class Revenue(Base):
    __tablename__ = "revenues"
    value = Column(Float, nullable=False)