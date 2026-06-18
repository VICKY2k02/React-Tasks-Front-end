from fastapi import APIRouter
from app.shared_data import ( 
    notifications, 
    reactivation_requests,
    attendance_access_requests,
    attendance_records,
    audit_logs
    )

router = APIRouter()



@router.get("/notifications/{email}")
def get_notifications(email: str):
    return [
        n for n in notifications
        if n["recipient_email"] == email
    ]


@router.put("/notifications/read-all")
def mark_all_read():

    notifications.clear()

    reactivation_requests.clear()

    return {
        "message":
        "All notifications cleared"
    }

@router.get("/notifications/company/{company_id}")
def get_company_notifications(company_id: str):

    return [
        n for n in notifications
        if n.get("company_id") == company_id
    ]


@router.get("/audit-logs/{company_id}")
def get_logs(company_id: str):

    return [
        log for log in audit_logs
        if log["company_id"] == company_id
    ]




