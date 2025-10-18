from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float, Text, Boolean

class Adress(Base):
    __tablename__ = "adres"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String, nullable=False)
    district = Column(String)
    area = Column(String)
    status = Column(Boolean, nullable=False)
    coords_width = Column(Float)
    coords_longitude = Column(Float)


