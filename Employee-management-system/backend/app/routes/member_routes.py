from fastapi import APIRouter, HTTPException
from app.routes.auth_routes import users
from app.shared_data import notifications
from app.shared_data import audit_logs
from datetime import datetime
from app.database.connection import SessionLocal
from app.models.audit_log import AuditLog

router = APIRouter()

@router.get("/members/{company_id}")
def get_members(company_id: int):

    return [

        {
            "email": user["email"],
            "role": user["role"],
            "status": user.get(
                "status",
                "Active"
            ),
            "reactivation_status": user.get(
                "reactivation_status",
                ""
            ),
            "reason": user.get(
                "reason",
                ""
            )
        }

        for user in users
        if user["company_id"] == company_id
    ]



@router.put("/members/{email}/deactivate")
def deactivate_member(email: str):

    for user in users:

        if user["email"] == email:

            user["status"] = "Deactivated"

            user["deactivated_by"] = "admin@gmail.com"

            notifications.append({
                "message":
                f"{email} account deactivated",
                "target_admin":
                "admin@gmail.com"
            })

            db = SessionLocal()

            new_log = AuditLog(
                user_name="admin@gmail.com",
                action="User Deactivated",
                related_user=email,
                company_id=user["company_id"]
            )

            db.add(new_log)
            db.commit()
            db.close()

            return {
                "message":
                "User deactivated"
            }

    raise HTTPException(
        status_code=404,
        detail="User not found"
    )


@router.put("/members/{email}/activate")
def activate_member(email: str):

    for user in users:

        if user["email"] == email:

            user["status"] = "Active"

            db = SessionLocal()

            new_log = AuditLog(
                user_name="admin@gmail.com",
                action="User Activated",
                related_user=email,
                company_id=user["company_id"]
            )

            db.add(new_log)
            db.commit()
            db.close()

            return {
                "message":
                "User activated"
            }

    raise HTTPException(
        status_code=404,
        detail="User not found"
    )