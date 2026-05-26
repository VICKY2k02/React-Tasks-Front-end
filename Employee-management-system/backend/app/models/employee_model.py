from sqlalchemy import Column, Integer, String
from app.database.connection import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, nullable=False)

    department = Column(String, nullable=False)

    designation = Column(String, nullable=True)

    status = Column(String, nullable=False)


    attendance = Column(String, nullable=False)