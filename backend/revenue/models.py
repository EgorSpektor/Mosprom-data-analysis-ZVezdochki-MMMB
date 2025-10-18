from sqlalchemy import Column, Float, ForeignKey, Integer
from database import Base
from sqlalchemy.orm import relationship


class Revenue(Base):
    __tablename__ = "revenues"
    value = Column(Float, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    company = relationship("Company", back_populates="revenues")