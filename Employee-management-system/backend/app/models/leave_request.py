from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean
)

from datetime import datetime

from app.database.connection import Base


class LeaveRequest(Base):

    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True)

    user_email = Column(String)

    company_id = Column(Integer)

    leave_type = Column(String)

    start_date = Column(String)

    end_date = Column(String)

    reason = Column(String)

    status = Column(
        String,
        default="Pending"
    )