from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import jwt
import datetime

router = APIRouter()

SECRET_KEY = "secret123"

users = [
    {
        "email": "admin@gmail.com",
        "password": "admin123",
        "role": "admin"
    },
    {
        "email": "user@gmail.com",
        "password": "user123",
        "role": "user"
    }
]

class SignupData(BaseModel):
    email: str
    password: str
    role: str

class LoginData(BaseModel):
    email: str
    password: str

class ForgotPasswordData(BaseModel):
    email: str
    new_password: str


@router.post("/signup")
def signup(data: SignupData):

    for user in users:
        if user["email"] == data.email:
            raise HTTPException(
                status_code=400,
                detail="User already has an account"
            )

    users.append({
        "email": data.email,
        "password": data.password,
        "role": data.role
    })

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
            and
            user["password"] == data.password
        ):

            token = jwt.encode(
                {
                    "email": user["email"],
                    "role": user["role"],
                    "exp": datetime.datetime.utcnow()
                    + datetime.timedelta(hours=1)
                },
                SECRET_KEY,
                algorithm="HS256"
            )

            return {
                "token": token,
                "role": user["role"],
                "email": user["email"]
            }

    raise HTTPException(
        status_code=401,
        detail="Invalid Credentials"
    )




@router.put("/forgot-password")
def forgot_password(data: ForgotPasswordData):

    for user in users:
        if user["email"] == data.email:
            user["password"] = data.new_password
            return {"message": "Password updated successfully"}

    raise HTTPException(
        status_code=404,
        detail="User not found"
    )