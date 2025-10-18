from sqlalchemy import Column, Float, ForeignKey, Integer, String
from database import Base



class Land(Base):
    __tablename__ = "lands"
    name = Column(String, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    phone_number = Column(String, nullable=False)