from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.audit_log import AuditLog

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_company_id(
    company_id: int = Header(...)
):
    return company_id

@router.get("/audit-logs")
def get_audit_logs(
    company_id: int = Depends(get_company_id),
    db: Session = Depends(get_db)
):

    return db.query(AuditLog).filter(
        AuditLog.company_id == company_id
    ).order_by(
        AuditLog.timestamp.desc()
    ).all()

    return logs


@router.delete("/audit-logs/clear")
def clear_audit_logs(
    company_id: int = Depends(get_company_id),
    db: Session = Depends(get_db)
):

    db.query(AuditLog).filter(
        AuditLog.company_id == company_id
    ).delete()

    db.commit()

    return {
        "success": True,
        "message": f"Company {company_id} audit logs cleared successfully"
    }