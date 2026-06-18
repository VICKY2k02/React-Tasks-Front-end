from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean
)

from datetime import datetime

from app.database.connection import Base


class AttendanceAccessRequest(Base):

    __tablename__ = "attendance_access_requests"

    id = Column(
        Integer,
        primary_key=True
    )

    id = Column(
        Integer,
        primary_key=True
    )

    user_email = Column(String)

    company_id = Column(Integer)

    date = Column(String)

    check_in = Column(String)

    check_out = Column(String)

    total_hours = Column(String)