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
        primary_key=True
    )

    email = Column(String)

    role = Column(String)

    company_id = Column(Integer)

    token = Column(String)

    status = Column(String)

    db.add(invitation)
    db.commit()