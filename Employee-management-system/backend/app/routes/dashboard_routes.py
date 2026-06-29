from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.employee_model import Employee
from app.routes.settings_routes import role_requests
from app.shared_data import (
    notifications,
    reactivation_requests,
    leave_requests,
    attendance_access_requests,
    suspension_requests
)
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

    pending_role_requests = len(role_requests)

    pending_reactivation_requests = len([
        req
        for req in reactivation_requests
        if req["status"] == "Pending"
    ])

    pending_leave_requests = len([
        req
        for req in leave_requests
        if req["status"] == "Pending"
        and req["company_id"] == company_id
    ])

    pending_attendance_requests = len([
        req
        for req in attendance_access_requests
        if req["status"] == "Pending"
        and req["company_id"] == company_id
    ])

    pending_reinstatement_requests = len([
        req
        for req in suspension_requests
        if req["status"] == "Pending"
        and next(
            (
                user for user in users
                if user["email"] == req["email"]
                and user["company_id"] == company_id
            ),
            None
        )
    ])

    pending_requests = (
        pending_role_requests +
        pending_reactivation_requests +
        pending_leave_requests +
        pending_attendance_requests+
        pending_reinstatement_requests
        # pending_attendance_requests

        # pending_reactivation_requests
    )

    return {
        "totalEmployees": total_employees,
        "activeEmployees": active_employees,
        "departments": departments,
        "pendingRequests": pending_requests,
        "pendingReinstatement": pending_reinstatement_requests
    }


# Role stats

@router.get("/role-stats")
def get_role_stats(
    company_id: int = Depends(get_company_id)
):

    company_users = [
        user for user in users
        if user["company_id"] == company_id
    ]

    admin_count = len([
        user for user in company_users
        if user["role"] == "admin"
    ])

    user_count = len([
        user for user in company_users
        if user["role"] == "user"
    ])

    return {
        "admin": admin_count,
        "user": user_count
    }