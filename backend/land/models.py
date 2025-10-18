from sqlalchemy import Column, Float, ForeignKey, Integer, String
from database import Base
from sqlalchemy.orm import relationship


class Land(Base):
    __tablename__ = "lands"
    number = Column(String, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    area = Column(Float, nullable=False)
    property_type = Column(String, nullable=False)
    usage = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    company = relationship("Company", back_populates="lands")