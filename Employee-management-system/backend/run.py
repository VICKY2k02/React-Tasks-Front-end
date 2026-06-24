from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine, Base

from app.routes.employee_routes import router as employee_router

from app.routes.auth_routes import router as auth_router

from app.routes.settings_routes import router as settings_router

from app.models.company import Company
from app.models.employee_model import Employee
from app.models.attendance_request import AttendanceAccessRequest
from app.models.leave_request import LeaveRequest
from app.models.activity_model import ActivityLog

from app.routes.audit_routes import router as audit_router
from app.routes import dashboard_routes
from app.routes.invitation_routes import router as invitation_router
from app.routes.member_routes import (router as member_router)
from app.routes.notification_routes import ( router as notification_router)
from app.routes.attendance_access_routes import router as attendance_access_router
from app.routes.leave_routes import router as leave_router
from app.routes.activity_routes import router as activity_router

from app.routes.export_routes import router as export_routes



# CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
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
app.include_router(attendance_access_router)
app.include_router(leave_router)
app.include_router(activity_router)
app.include_router(export_routes)




# SUCCESS MESSAGE
@app.on_event("startup")
def startup_event():

    print("Backend Successfully Running...")



#settings router
app.include_router(settings_router)

