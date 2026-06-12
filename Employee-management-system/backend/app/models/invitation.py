from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from datetime import datetime

from app.database.connection import Base


class Invitation(Base):

    __tablename__ = "invitations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        nullable=False
    )

    token = Column(
        String,
        unique=True
    )

    status = Column(
        String,
        default="Pending"
    )

    company_id = Column(
        Integer,
        nullable=False
    )

    created_by = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )