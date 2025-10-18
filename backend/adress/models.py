from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.orm import relationship

class Adress(Base):
    __tablename__ = "adres"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String, nullable=False)
    district = Column(String)
    area = Column(String)
    year = Column(Integer, nullable=False)
    company = relationship("Company", back_populates="addresses")



