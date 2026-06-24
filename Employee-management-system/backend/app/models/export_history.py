from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database.connection import Base

class ExportHistory(Base):
    __tablename__ = "export_history"

    id = Column(Integer, primary_key=True)
    company_id = Column(Integer)
    exported_by = Column(String)
    data_type = Column(String)
    export_format = Column(String)
    exported_at = Column(DateTime, default=datetime.utcnow)