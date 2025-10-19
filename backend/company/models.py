from database import Base

from sqlalchemy import Column, Float, Integer, String, BigInteger 
from sqlalchemy.orm import relationship

# Ensure related model modules are imported so their mappers are registered
# before this Company mapper is configured (prevents 'Land' not found errors).
import land.models  # noqa: F401
import leader.models  # noqa: F401


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    inn = Column(BigInteger, nullable=False)
    name = Column(String, nullable=False)
    fullname = Column(String, nullable=False)
    area_room = Column(Float, nullable=False)
    export = Column(Float, nullable=False)
    email = Column(String, nullable=False)
    web = Column(String, nullable=False)
    
    # relationships
    addresses = relationship("Adress", back_populates="company", lazy="selectin")
    staff = relationship("Staff", back_populates="company", lazy="selectin")
    revenues = relationship("Revenue", back_populates="company", lazy="selectin")
    profits = relationship("Profit", back_populates="company", lazy="selectin")
    investments = relationship("Investment", back_populates="company", lazy="selectin")
    taxes = relationship("Tax", back_populates="company", lazy="selectin")
    lands = relationship("Land", back_populates="company", lazy="selectin")
    leaders = relationship("Leader", back_populates="company", lazy="selectin")