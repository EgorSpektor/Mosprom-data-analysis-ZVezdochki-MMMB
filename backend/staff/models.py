from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.orm import relationship


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    value = Column(Float, nullable=False)
    value_payment = Column(Float, nullable=False)

    company = relationship("Company", back_populates="staff")
    