from sqlalchemy import Column, Float, ForeignKey, Integer
from database import Base
from sqlalchemy.orm import relationship


class Profit(Base):
    __tablename__ = "profits"
    value = Column(Float, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    company = relationship("Company", back_populates="profits")