from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import jwt
import datetime
from app.shared_data import audit_logs
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.activity_model import ActivityLog
from app.models.audit_log import AuditLog

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

SECRET_KEY = "secret123"

def create_audit_log(db, user_name, action, related_user, company_id):
    audit = AuditLog(
        user_name=user_name,
        action=action,
        related_user=related_user,
        company_id=company_id
    )

    db.add(audit)
    db.commit()

def get_browser_name(user_agent):
    ua = user_agent.lower()

    if "edg" in ua:
        return "Edge"
    elif "chrome" in ua:
        return "Chrome"
    elif "firefox" in ua:
        return "Firefox"
    elif "safari" in ua:
        return "Safari"
    else:
        return "Unknown"

users = [
    {
        "email": "admin@gmail.com",
        "password": "admin123",
        "role": "admin",
        "company_id": 1
    },
    {
        "email": "user@gmail.com",
        "password": "user123",
        "role": "user",
        "company_id": 1
    },

       {
        "email": "admin2@gmail.com",
        "password": "admin123",
        "role": "admin",
        "company_id": 2
    },
        {
        "email": "user2@gmail.com",
        "password": "user123",
        "role": "user",
        "company_id": 2
    }
]

class SignupData(BaseModel):
    email: str
    password: str
    role: str
    company_id: int

class LoginData(BaseModel):
    email: str
    password: str

class ForgotPasswordData(BaseModel):
    email: str
    new_password: str

class LogoutData(BaseModel):
    email: str


@router.post("/signup")
def signup(data: SignupData):

    for user in users:

        if user["email"].lower() == data.email.lower():

            company_name = (
                "Company A"
                if user["company_id"] == 1
                else "Company B"
            )

            raise HTTPException(
                status_code=400,
                detail=f"User already exists in {company_name}"
            )

    users.append({
        "email": data.email,
        "password": data.password,
        "role": data.role,
        "company_id": data.company_id,
        "status": "Active"      # Added
    })

    print("AUDIT LOGS:", audit_logs)

    return {
        "success": True,
        "message": "Account created successfully"
    }

@router.post("/login")
def login(data: LoginData, request: Request):

    print("Login Request:", data.email, data.password)
    print("Current Users:", users)

    db = get_db()

    for user in users:

        if (
            user["email"].lower() == data.email.lower()
            and user["password"] == data.password
        ):

            # Check if account is deactivated
            if user.get("status") == "Deactivated":
                return {
                    "status": "deactivated",
                    "email": user["email"]
                }

            # -------------------------------
            # Activity Log
            # -------------------------------
            user_agent = request.headers.get("user-agent", "")
            browser = get_browser_name(user_agent)
            ip_address = request.client.host

            existing_device = db.query(ActivityLog).filter(
                ActivityLog.user_email == user["email"],
                ActivityLog.browser == browser
            ).first()

            existing_ip = db.query(ActivityLog).filter(
                ActivityLog.user_email == user["email"],
                ActivityLog.ip_address == ip_address
            ).first()

            is_new_device = existing_device is None
            is_new_ip = existing_ip is None

            activity = ActivityLog(
                user_email=user["email"],
                company_id=user.get("company_id", 1),
                last_login=datetime.datetime.utcnow() + datetime.timedelta(hours=5, minutes=30),
                browser=browser,
                ip_address=ip_address,
                event_type="LOGIN",
                is_new_device=is_new_device,
                is_new_ip=is_new_ip,
                created_at=datetime.datetime.utcnow() + datetime.timedelta(hours=5, minutes=30)
            )

            db.add(activity)
            db.commit()

            create_audit_log(
                db=db,
                user_name="Admin" if user["role"] == "admin" else "User",
                action="LOGIN",
                related_user=user["email"],
                company_id=user["company_id"]
            )

            # -------------------------------
            # Generate JWT Token
            # -------------------------------
            token = jwt.encode(
                {
                    "email": user["email"],
                    "role": user["role"],
                    "company_id": user.get("company_id", 1),
                    "exp": datetime.datetime.utcnow()
                    + datetime.timedelta(hours=1)
                },
                SECRET_KEY,
                algorithm="HS256"
            )

            return {
                "token": token,
                "role": user["role"],
                "email": user["email"],
                "company_id": user.get("company_id", 1),
                "is_new_device": is_new_device,
                "is_new_ip": is_new_ip
            }

            failed_user = next(
                (u for u in users if u["email"] == data.email),
                None
            )

            if failed_user:
                db = SessionLocal()

                create_audit_log(
                    db=db,
                    user_name=data.email,
                    action="LOGIN FAILED",
                    related_user="Wrong Password",
                    company_id=failed_user["company_id"]
                )

                db.close()


    raise HTTPException(
        status_code=401,
        detail="Invalid Credentials"
    )



# ForgotPassword

@router.put("/forgot-password")
def forgot_password(data: ForgotPasswordData):

    print("Forgot Password Email:", data.email)
    print("Current Users:", users)

    for user in users:
        if user["email"].lower() == data.email.lower():
            user["password"] = data.new_password

            return {
                "message": "Password updated successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="User not found"
    )


@router.post("/logout")
def logout(data: LogoutData):
    db = SessionLocal()

    try:
        email = data.email
        print("Logout email:", email)

        # Find user from users list
        logged_out_user = next(
            (u for u in users if u["email"] == email),
            None
        )

        latest_activity = db.query(ActivityLog).filter(
            ActivityLog.user_email == email,
            ActivityLog.last_logout == None
        ).order_by(
            ActivityLog.last_login.desc()
        ).first()

        if latest_activity:
            latest_activity.last_logout = (
                datetime.datetime.utcnow()
                + datetime.timedelta(hours=5, minutes=30)
            )
            latest_activity.event_type = "LOGOUT"
            db.commit()

            create_audit_log(
                db=db,
                user_name=(
                    "Admin"
                    if logged_out_user
                    and logged_out_user["role"] == "admin"
                    else "User"
                ),
                action="LOGOUT",
                related_user=email,
                company_id=latest_activity.company_id
            )

        return {
            "message": "Logged out successfully"
        }

    finally:
        db.close()