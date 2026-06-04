from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from app.routes.auth_routes import users

router = APIRouter()

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

    for user in users:

        if user["email"] == user_email:

            user["role"] = "admin"

            break

    global role_requests

    role_requests = [
        req for req in role_requests
        if req["user_email"] != user_email
    ]

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

    global role_requests

    role_requests = [
        req for req in role_requests
        if req["user_email"] != user_email
    ]

    return {
        "success": True,
        "message": "Request Rejected"
    }