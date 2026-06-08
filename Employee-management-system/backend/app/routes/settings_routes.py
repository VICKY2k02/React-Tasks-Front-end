from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from app.routes.auth_routes import users

from app.util.audit_logger import create_audit_log
from app.database.connection import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        pass

role_requests = []


class RoleRequest(BaseModel):

    user_email: str
    current_password: str
    admin_email: str

#  For Request-role

@router.post("/request-role-change")
def request_role_change(
    request: RoleRequest
):


    user = None

    for u in users:

        if (
            u["email"] ==
            request.user_email
        ):
            user = u
            break

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if (
        user["password"]
        != request.current_password
    ):

        raise HTTPException(
            status_code=401,
            detail="Password incorrect"
        )

    print("Request Admin Email:", request.admin_email)
    print("Current Users:", users)    

    admin_found = False

    for u in users:

        if (
            u["email"]
            == request.admin_email
            and
            u["role"] == "admin"
        ):

            admin_found = True
            break

    if not admin_found:

        raise HTTPException(
            status_code=404,
            detail="Admin email not found"
        )

    role_requests.append({

        "user_email":
            request.user_email,

        "admin_email":
            request.admin_email,

        "status":
            "Pending"
    })

    db = get_db()
    create_audit_log(
        db=db,
        user_name=request.user_email,
        action="Role Change Requested",
        related_user=request.admin_email,
        company_id=user.get("company_id", 1)
)

    return {
        "success": True,
        "message":
        "Role change request submitted successfully"
    }


# Approve-role-request

@router.post("/approve-role-request")
def approve_role_request(
    user_email: str = Body(...)
):

    db = get_db()

    approved_user = None

    for user in users:

        if user["email"] == user_email:

            user["role"] = "admin"
            approved_user = user
            break

    create_audit_log(
        db=db,
        user_name="Admin",
        action="Role Change Approved",
        related_user=user_email,
        company_id=approved_user.get("company_id", 1)
        if approved_user else 1
    )

    role_requests[:] = [
        req for req in role_requests
        if req["user_email"] != user_email
    ]

    print("After Approve:", role_requests)

    return {
        "success": True,
        "message": "User promoted to Admin"
    }


# Role Request for admin-email

@router.get("/role-requests/{admin_email}")
def get_role_requests(admin_email: str):

    return [
        req
        for req in role_requests
        if req["admin_email"] == admin_email
    ]

 #Reject-role-request

@router.post("/reject-role-request")
def reject_role_request(
    user_email: str = Body(...)
):

    db = get_db()

    rejected_user = None

    for user in users:

        if user["email"] == user_email:
            rejected_user = user
            break

    # AUDIT LOG
    create_audit_log(
        db=db,
        user_name="Admin",
        action="Role Change Rejected",
        related_user=user_email,
        company_id=rejected_user.get("company_id", 1)
        if rejected_user else 1
    )

    global role_requests

    role_requests[:] = [
        req for req in role_requests
        if req["user_email"] != user_email
    ]

    return {
        "success": True,
        "message": "Request Rejected"
    }