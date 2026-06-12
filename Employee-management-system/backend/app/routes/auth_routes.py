from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import jwt
import datetime
from app.shared_data import audit_logs
# from datetime import datetime

router = APIRouter()

SECRET_KEY = "secret123"

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
def login(data: LoginData):

    print("Login Request:", data.email, data.password)
    print("Current Users:", users)

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

            # Generate token for active users
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
                "company_id": user.get("company_id", 1)
            }

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

