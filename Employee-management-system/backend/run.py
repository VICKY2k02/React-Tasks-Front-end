from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine, Base

from app.routes.employee_routes import router as employee_router

from app.routes.auth_routes import router as auth_router

from app.routes.settings_routes import router as settings_router

from app.models.company import Company
from app.models.employee_model import Employee

from app.routes.audit_routes import router as audit_router
from app.routes import dashboard_routes
from app.routes.invitation_routes import router as invitation_router
from app.routes.member_routes import (router as member_router)
from app.routes.notification_routes import ( router as notification_router)
# CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# EMPLOYEE ROUTES
app.include_router(employee_router)

# AUTH ROUTES
app.include_router(auth_router)
app.include_router(audit_router)
app.include_router(dashboard_routes.router)
app.include_router(invitation_router)
app.include_router( member_router)
app.include_router(notification_router)


# SUCCESS MESSAGE
@app.on_event("startup")
def startup_event():

    print("Backend Successfully Running...")



#settings router
app.include_router(settings_router)

