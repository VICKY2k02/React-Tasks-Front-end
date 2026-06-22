from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.activity_model import ActivityLog

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/activity/{company_id}")
def get_activity(company_id: int):
    db = SessionLocal()

    try:
        logs = db.query(ActivityLog).filter(
            ActivityLog.company_id == company_id
        ).order_by(
            ActivityLog.last_login.desc()
        ).all()

        return logs

    finally:
        db.close()







@router.delete("/activity/clear/{company_id}")
def clear_activity(company_id: int):
    db = SessionLocal()

    try:
        db.query(ActivityLog).filter(
            ActivityLog.company_id == company_id
        ).delete()

        db.commit()

        return {
            "message": "All activity logs cleared"
        }

    finally:
        db.close()