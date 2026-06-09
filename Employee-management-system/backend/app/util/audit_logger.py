from app.models.audit_log import AuditLog
from app.database.connection import SessionLocal


def create_audit_log(
    db,
    user_name,
    action,
    related_user,
    company_id
):

    log = AuditLog(
        user_name=user_name,
        action=action,
        related_user=related_user,
        company_id=company_id,
        
    )

    db.add(log)
    db.commit()