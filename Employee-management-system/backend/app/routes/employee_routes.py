from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.employee_model import Employee
from app.schemas.employee_schema import EmployeeCreate

router = APIRouter()


# DATABASE CONNECTION
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# GET COMPANY ID FROM REQUEST HEADER
def get_company_id(
    company_id: int = Header(...)
):
    return company_id


# GET ALL EMPLOYEES

@router.get("/employees")
def fetch_employees(
    company_id: int = Depends(get_company_id),
    db: Session = Depends(get_db)
):
    return db.query(Employee).filter(
        Employee.company_id == company_id
    ).all()

    return employees


# ADD EMPLOYEE

@router.post("/employees")
def create_employee(
    employee: EmployeeCreate,
    company_id: int = Header(...),
    db: Session = Depends(get_db)
):

    # CHECK DUPLICATE EMPLOYEE
    existing_employee = db.query(Employee).filter(
        Employee.name == employee.name,
        Employee.email == employee.email
    ).first()

    if existing_employee:
        raise HTTPException(
            status_code=400,
            detail=f"Employee already exists in Company {existing_employee.company_id}"
        )

    # CREATE EMPLOYEE
    new_employee = Employee(
        name=employee.name,
        email=employee.email,
        department=employee.department,
        designation=employee.designation,
        attendance=employee.attendance,
        status=employee.status,
        company_id=company_id
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
    company_id: int = Depends(get_company_id),
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company_id == company_id
    ).first()

    if not employee:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    db.delete(employee)

    db.commit()

    return {
        "success": True,
        "message": "Employee deleted successfully"
    }


# UPDATE EMPLOYEE
@router.put("/employees/{employee_id}")
def edit_employee(
    employee_id: int,
    employee_data: EmployeeCreate,
    company_id: int = Depends(get_company_id),
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company_id == company_id
    ).first()

    if not employee:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    employee.name = employee_data.name
    employee.email = employee_data.email
    employee.department = employee_data.department
    employee.designation = employee_data.designation
    employee.attendance = employee_data.attendance
    employee.status = employee_data.status

    db.commit()

    db.refresh(employee)

    return {
        "success": True,
        "message": "Employee updated successfully",
        "data": employee
    }


# UPDATE EMPLOYEE STATUS
@router.put("/employees/{employee_id}/status")
def update_status(
    employee_id: int,
    status: str,
    company_id: int = Depends(get_company_id),
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company_id == company_id
    ).first()

    if not employee:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    employee.status = status

    db.commit()

    db.refresh(employee)

    return {
        "success": True,
        "message": "Status updated successfully",
        "data": employee
    }