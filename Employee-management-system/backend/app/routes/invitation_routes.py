from fastapi import APIRouter
from pydantic import BaseModel
import uuid
from app.routes.auth_routes import users
from pydantic import BaseModel
from datetime import datetime
from app.shared_data import (
    notifications,
    reactivation_requests,
    invitations,
    audit_logs
)

from app.database.connection import SessionLocal
from app.models.audit_log import AuditLog


router = APIRouter()



class ReactivationRequest(BaseModel):
    email: str
    reason: str

class InvitationData(BaseModel):
    email: str
    role: str
    company_id: int


@router.get("/invitations")
def get_invitations():
    return invitations


@router.post("/invitations")
def create_invitation(data: InvitationData):

    token = str(uuid.uuid4())

    invitation = {
        "id": len(invitations) + 1,
        "email": data.email,
        "role": data.role,
        "company_id": data.company_id,
        "token": token,
        "status": "Pending"
    }

    invitations.append(invitation)

    db = SessionLocal()

    new_log = AuditLog(
        user_name="admin@gmail.com",
        action="Invitation Created",
        related_user=data.email,
        company_id=data.company_id
    )

    db.add(new_log)
    db.commit()
    db.close()

    return {
        "message": "Invitation created",
        "link": f"http://localhost:3000/invite/{token}"
    }


@router.get("/invite/{token}")
def get_invitation(token: str):

    for invite in invitations:

        if invite["token"] == token:
            return invite

    return {
        "message": "Invalid invitation"
    }


@router.put("/invitations/{invite_id}/revoke")
def revoke_invitation(invite_id: int):

    for invite in invitations:

        if invite["id"] == invite_id:

            invite["status"] = "Revoked"

            audit_logs.append({
                "id": len(audit_logs) + 1,
                "user_name": "admin@gmail.com",
                "action": "Invitation Revoked",
                "related_user": invite["email"],
                "timestamp": datetime.now().isoformat()
            })

            return {
                "message": "Invitation revoked"
            }

    return {
        "message": "Invitation not found"
    }


@router.get("/reactivation-requests")
def get_requests():

    return reactivation_requests


@router.put("/reactivation/{email}/approve")
def approve_request(email: str):

    for user in users:

        if user["email"] == email:

            user["status"] = "Active"
            user["reactivation_status"] = "Approved"

    reactivation_requests[:] = [
        req
        for req in reactivation_requests
        if req["email"] != email
    ]

    notifications.append({
        "message":
        f"{email} reactivation approved"
    })

    db = SessionLocal()

    new_log = AuditLog(
        user_name="admin@gmail.com",
        action="Reactivation Approved",
        related_user=email,
        company_id=user["company_id"]
    )

    db.add(new_log)
    db.commit()
    db.close()
        

    

    return {
        "message": "Approved"
    }

@router.put("/reactivation/{email}/reject")
def reject_request(email: str):

    for user in users:

        if user["email"] == email:

            user["reactivation_status"] = "Rejected"

    reactivation_requests[:] = [
        req
        for req in reactivation_requests
        if req["email"] != email
    ]

    notifications.append({
        "message":
        f"{email} reactivation rejected"
    })

    db = SessionLocal()

    new_log = AuditLog(
        user_name="admin@gmail.com",
        action="Reactivation Rejected",
        related_user=email,
        company_id=user["company_id"]
    )

    db.add(new_log)
    db.commit()
    db.close()

    return {
        "message": "Rejected"
    }

@router.post("/reactivation-request")
def submit_reactivation(data: ReactivationRequest):

    for user in users:

        if user["email"].lower() == data.email.lower():

            user["reactivation_status"] = "Pending"
            user["reason"] = data.reason

            request_exists = any(
                req["email"].lower() == data.email.lower()
                and req["status"] == "Pending"
                for req in reactivation_requests
            )

            if not request_exists:

                reactivation_requests.append({
                    "email": data.email,
                    "reason": data.reason,
                    "status": "Pending"
                })


                
                notifications.append({
                    "action": "Reactivation Request",
                    "related_user": data.email,
                    "message": f"{data.email} requested reactivation"
                })

            audit_logs.append({
                "id": len(audit_logs) + 1,
                "user_name": data.email,
                "action": "Reactivation Request Submitted",
                "related_user": data.email,
                "timestamp": datetime.now().isoformat()
            })

            return {
                "message": "Request Submitted"
            }

    return {
        "message": "User not found"
    }
    
@router.get("/notifications")
def get_notifications():
    return notifications








