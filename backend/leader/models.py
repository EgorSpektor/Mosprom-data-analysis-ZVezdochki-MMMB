from sqlalchemy import Column, Float, ForeignKey, Integer, String
from database import Base
from sqlalchemy.orm import relationship



class Leader(Base):
    __tablename__ = "leaders"
    name = Column(String, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    phone_number = Column(String, nullable=False)

    company = relationship("Company", back_populates="leaders")