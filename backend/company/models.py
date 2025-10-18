from database import Base
from sqlalchemy import Column, Integer, String

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    inn = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    fullname = Column(String, nullable=False)
    year = Column(Integer, nullable=False)