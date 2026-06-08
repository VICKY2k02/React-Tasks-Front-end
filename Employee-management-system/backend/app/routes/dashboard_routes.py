from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.employee_model import Employee
from app.routes.settings_routes import role_requests
from app.routes.auth_routes import users

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_company_id(
    company_id: int = Header(...)
):
    return company_id


@router.get("/dashboard-stats")
def get_dashboard_stats(
    company_id: int = Depends(get_company_id),
    db: Session = Depends(get_db)
):

    employees = db.query(Employee).filter(
        Employee.company_id == company_id
    ).all()

    total_employees = len(employees)

    active_employees = len([
        emp for emp in employees
        if emp.status == "Active"
    ])

    departments = len(
        set(emp.department for emp in employees)
    )

    pending_requests = len(role_requests)

    return {
        "totalEmployees": total_employees,
        "activeEmployees": active_employees,
        "departments": departments,
        "pendingRequests": pending_requests
    }


@router.get("/role-stats")
def get_role_stats():

    admin_count = len([
        u for u in users
        if u["role"] == "admin"
    ])

    user_count = len([
        u for u in users
        if u["role"] == "user"
    ])

    return {
        "admin": admin_count,
        "user": user_count
    }