from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean

from app.database.connection import Base


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(
        Integer,
        primary_key=True
    )

    recipient_email = Column(
        String
    )

    message = Column(
        String
    )

    is_read = Column(
        Boolean,
        default=False
    )

    company_id = Column(
        Integer
    )