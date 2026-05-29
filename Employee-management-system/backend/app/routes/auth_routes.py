from fastapi import APIRouter, HTTPException

from pydantic import BaseModel

import jwt
import datetime

router = APIRouter()

SECRET_KEY = "secret123"


class LoginData(BaseModel):
    email: str
    password: str


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


@router.post("/login")
def login(data: LoginData):

    for user in users:

        if (
            user["email"] == data.email
            and
            user["password"] == data.password
        ):

            token = jwt.encode(
                {
                    "email": data.email,
                    "exp": datetime.datetime.utcnow()
                    + datetime.timedelta(hours=1)
                },
                SECRET_KEY,
                algorithm="HS256"
            )

            return {
                "token": token,
                "role": user["role"],
                "email": data.email
            }

    raise HTTPException(
        status_code=401,
        detail="Invalid Credentials"
    )