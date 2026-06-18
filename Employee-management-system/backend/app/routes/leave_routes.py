from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.connection import SessionLocal
from app.models.audit_log import AuditLog
from app.shared_data import leave_requests, notifications
from app.routes.auth_routes import users

router = APIRouter()


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Submit Leave Request
@router.post("/leave/request")
def submit_leave(data: dict, db: Session = Depends(get_db)):
    

    user = next(
        (u for u in users if u["email"] == data["email"]),
        None
    )

    print( user)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

      
    request = {
        "id": len(leave_requests) + 1,
        "email": data["email"],
        "company_id": user["company_id"],
        "leave_type": data.get("leave_type"),
        "from_date": data.get("from_date"),
        "to_date": data.get("to_date"),
        "reason": data.get("reason"),
        "status": "Pending",
        "created_at": datetime.now().isoformat()
    }

    leave_requests.append(request)

    audit = AuditLog(
        user_name=user.get("name", user["email"]),
        action="Leave Request Submitted",
        related_user=user["email"],
        company_id=user["company_id"]
    )

    db.add(audit)
    db.commit()

    
    print("Current Users:", users)
    for admin in users:
        if (
            admin.get("role") == "admin"
            and admin.get("company_id") == user.get("company_id")
        ):
            notifications.append({
                "id": len(notifications) + 1,
                "recipient_email": admin["email"],
                "company_id": user["company_id"],
                "email": user["email"],
                "leave_type": data.get("leave_type"),
                "from_date": data.get("from_date"),
                "to_date": data.get("to_date"),
                "reason": data.get("reason"),
                "status": "Pending",
                "message": f"{user['email']} requested leave",
                "read": False
            })

            print("Notifications:", notifications)
            
            return request


# Get Company Leave Requests
@router.get("/leave/company/{company_id}")
def company_leaves(company_id: int):
    return [
        req
        for req in leave_requests
        if req["company_id"] == company_id
    ]


# Get My Leave Requests
@router.get("/leave/my/{email}")
def my_leave_requests(email: str):
    return [
        req
        for req in leave_requests
        if req["email"] == email
    ]


# Approve Leave Request
@router.put("/leave/approve/{leave_id}")
def approve_leave(
    leave_id: int,
    db: Session = Depends(get_db)
):

    for req in leave_requests:

        if req["id"] == leave_id:

            req["status"] = "Approved"

            notifications.append({
                "id": len(notifications) + 1,
                "type": "leave_approved",
                "message": "Your leave request has been approved",
                "recipient_email": req["email"],
                "company_id": req["company_id"],
                "leave_id": leave_id,
                "status": "Approved",
                "read": False
            })

            audit = AuditLog(
                user_name="Admin",
                action="Leave Request Approved",
                related_user=req["email"],
                company_id=req["company_id"],
                timestamp=datetime.now()
            )

            db.add(audit)
            db.commit()

            return req

    raise HTTPException(
        status_code=404,
        detail="Leave not found"
    )


# Reject Leave Request
@router.put("/leave/reject/{leave_id}")
def reject_leave(
    leave_id: int,
    db: Session = Depends(get_db)
):

    for req in leave_requests:

        if req["id"] == leave_id:

            req["status"] = "Rejected"

            notifications.append({
                "id": len(notifications) + 1,
                "type": "leave_rejected",
                "message": "Your leave request has been rejected",
                "recipient_email": req["email"],
                "company_id": req["company_id"],
                "leave_id": leave_id,
                "status": "Rejected",
                "read": False
            })

            audit = AuditLog(
                user_name="Admin",
                action="Leave Request Rejected",
                related_user=req["email"],
                company_id=req["company_id"],
                timestamp=datetime.now()
            )

            db.add(audit)
            db.commit()

            return req

    raise HTTPException(
        status_code=404,
        detail="Leave not found"
    )