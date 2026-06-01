from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.connection import SessionLocal

from app.models.employee_model import Employee

from app.schemas.employee_schema import (
    EmployeeCreate,
    EmployeeResponse
)

from app.services.employee_services import (
    get_all_employees,
    create_employee,
    delete_employee,
    update_employee_status,
    update_employee
)

router = APIRouter()


# DATABASE CONNECTION

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# GET EMPLOYEES

@router.get("/employees")

def fetch_employees(db: Session = Depends(get_db)):

    return get_all_employees(db)


# ADD EMPLOYEE

@router.post("/employees")
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):

    new_employee = Employee(
        name=employee.name,
        email=employee.email,
        department=employee.department,
        designation=employee.designation,
        attendance=employee.attendance,
        status=employee.status
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return {
        "success": True,
        "message": "Employee created successfully",
        "data": new_employee
    }

# DELETE EMPLOYEE

@router.delete("/employees/{employee_id}")

def remove_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):

    employee = delete_employee(db, employee_id)

    if not employee:

        return {
            "success": False,
            "message": "Employee not found"
        }

    return {
        "success": True,
        "message": "Employee deleted successfully"
    }


# UPDATE EMPLOYEE


@router.put("/employees/{employee_id}")

def edit_employee(
    employee_id: int,
    employee: EmployeeCreate,
    db: Session = Depends(get_db)
):

    updated_employee = update_employee(
        db,
        employee_id,
        employee
    )

    if not updated_employee:

        return {
            "success": False,
            "message": "Employee not found"
        }

    return {
        "success": True,
        "message": "Employee updated successfully",
        "data": updated_employee
    }

# UPDATE STATUS

@router.put("/employees/{employee_id}/status")

def update_status(
    employee_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    employee = update_employee_status(
        db,
        employee_id,
        status
    )

    if not employee:

        return {
            "success": False,
            "message": "Employee not found"
        }

    return employee



