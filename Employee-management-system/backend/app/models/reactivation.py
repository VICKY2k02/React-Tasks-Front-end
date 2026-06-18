from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from app.database.connection import Base

class ReactivationRequest(Base):

    __tablename__ = "reactivation_requests"

    id = Column(
        Integer,
        primary_key=True
    )

    email = Column(String)

    reason = Column(String)

    status = Column(String)