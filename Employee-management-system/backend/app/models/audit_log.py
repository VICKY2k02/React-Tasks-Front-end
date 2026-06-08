from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timedelta

from app.database.connection import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_name = Column(String, nullable=False)

    action = Column(String, nullable=False)

    related_user = Column(String, nullable=True)

    company_id = Column(Integer, nullable=False)

    timestamp = Column(
        DateTime,
        default=lambda: datetime.utcnow() + timedelta(hours=5, minutes=30)

    )
