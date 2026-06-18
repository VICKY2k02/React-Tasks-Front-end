from sqlalchemy import Column, Integer, String
from app.database.connection import Base

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True)

    password = Column(String)

    role = Column(String)

    company_id = Column(Integer)

    status = Column(String, default="Active")

    reactivation_status = Column(String, default="")

    reason = Column(String, default="")

    deactivated_by = Column(String, nullable=True)

    attendance_access = Column(Boolean,default=False)