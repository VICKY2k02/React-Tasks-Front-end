from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.routes.auth_routes import users
from app.shared_data import notifications, suspension_requests
from app.database.connection import SessionLocal
from app.models.audit_log import AuditLog
import datetime


router = APIRouter()

class SuspendRequest(BaseModel):
    email: str
    reason: str

class ReinstateRequest(BaseModel):
    email: str
    reason: str


def create_audit_log(db, user_name, action, related_user, company_id):
    audit = AuditLog(
        user_name=user_name,
        action=action,
        related_user=related_user,
        company_id=company_id
    )
    db.add(audit)
    db.commit()



@router.put("/suspend")
def suspend_user(payload: SuspendRequest, admin_email: str = Header(...)):
    db = SessionLocal()

    admin = next(
        (u for u in users if u["email"] == admin_email),
        None
    )

    if not admin:
        raise HTTPException(404, "Admin not found")

    target = next(
        (
            u for u in users
            if u["email"] == payload.email
            and u["company_id"] == admin["company_id"]
        ),
        None
    )

    if not target:
        raise HTTPException(404, "User not found")

    if target["role"] == "admin":
        action = "Admin Suspended"
    else:
        action = "User Suspended"

    target["status"] = "Suspended"
    target["suspension_reason"] = payload.reason
    target["suspended_by"] = admin_email

    target["suspended_at"] = (
        datetime.datetime.utcnow()
        + datetime.timedelta(hours=5, minutes=30)
    ).strftime("%d-%m-%Y %I:%M %p")


    print("Suspended user:", target)

    notifications.append({
        "recipient_email": payload.email,
        "message": "Account Suspended",
        "company_id": admin["company_id"]
    })

    create_audit_log(
        db,
        "Admin",
        action,
        payload.email,
        admin["company_id"]
    )

    db.close()

    return {"message": "User suspended"}




@router.post("/reinstatement-request")
def request_reinstate(payload: ReinstateRequest):
    
    db = SessionLocal()
    user = next(
        (u for u in users if u["email"] == payload.email),
        None
    )

    if not user:
        raise HTTPException(404, "User not found")

    user["reactivation_status"] = "Pending"
    user["reason"] = payload.reason

    suspension_requests.append({
        "email": payload.email,
        "reason": payload.reason,
        "status": "Pending"
    })

    suspended_admin = user.get("suspended_by")

    if suspended_admin:
        notifications.append({
            "recipient_email": suspended_admin,
            "email": payload.email,
            "reason": payload.reason,
            "status": "Pending",
            "type": "reinstatement"
        })


        create_audit_log(
            db,
            payload.email,
            "Reinstatement Request Submitted",
            payload.email,
            user["company_id"]
        )

        db.close()


    return {"message": "Request Submitted"}


@router.get("/reinstatement-requests")
def get_reinstatement_requests():
    return suspension_requests

@router.put("/reinstate")
def reinstate(email: str):
    db = SessionLocal()

    user = next(
        (u for u in users if u["email"] == email),
        None
    )

    if not user:
        raise HTTPException(404, "User not found")

    req = next(
        (r for r in suspension_requests if r["email"] == email),
        None
    )

    if not req:
        raise HTTPException(404, "Request not found")

    req["status"] = "Approved"

    user["reactivation_status"] = "Approved"

    notifications[:] = [
        n for n in notifications
        if not (
            n.get("type") == "reinstatement"
            and n.get("email") == email
        )
    ]

    suspension_requests.remove(req)

    user["status"] = "Active"
    user["suspension_reason"] = None
    user["suspended_by"] = None
    user["suspended_at"] = None

    create_audit_log(
        db,
        "Admin",
        "User Reinstated",
        email,
        user["company_id"]
    )

    db.close()

    return {"message": "User reinstated"}


@router.put("/reject-reinstate")
def reject(email: str):
    db = SessionLocal()

    user = next(
        (u for u in users if u["email"] == email),
        None
    )

    if not user:
        raise HTTPException(404, "User not found")

    req = next(
        (r for r in suspension_requests if r["email"] == email),
        None
    )

    if not req:
        raise HTTPException(404, "Request not found")

    req["status"] = "Rejected"

    user["reactivation_status"] = "Rejected"


    notifications[:] = [
        n for n in notifications
        if not (
            n.get("type") == "reinstatement"
            and n.get("email") == email
        )
    ]

    suspension_requests.remove(req)

    create_audit_log(
        db,
        "Admin",
        "Reinstatement Rejected",
        email,
        user["company_id"]
    )

    db.close()

    return {"message": "Rejected"}