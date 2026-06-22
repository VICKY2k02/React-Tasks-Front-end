from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database.connection import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_email = Column(String, nullable=True)   # ADD THIS

    company_id = Column(Integer, nullable=False)

    last_login = Column(DateTime, nullable=True)

    last_logout = Column(DateTime, nullable=True)

    browser = Column(String, nullable=False)

    ip_address = Column(String, nullable=False)

    event_type = Column(String, nullable=True)

    is_new_device = Column(Boolean, default=False)

    is_new_ip = Column(Boolean, default=False)

    created_at = Column(DateTime, nullable=True)