from sqlalchemy.orm import Session

from app.models.employee_model import Employee


# GET ALL EMPLOYEES

def get_all_employees(db: Session):

    employees = db.query(Employee).filter(
        Employee.company_id == current_user.company_id
    ).all()

    return employees


# CREATE EMPLOYEE

def create_employee(
    db,
    employee_data,
    company_id
):

    existing_employee = db.query(Employee).filter(
        Employee.email == employee_data.email
    ).first()

    if existing_employee:

        company_name = (
            "Company A"
            if existing_employee.company_id == 1
            else "Company B"
        )

        raise HTTPException(
            status_code=400,
            detail=f"Employee already exists in {company_name}"
        )

    new_employee = Employee(
        name=employee_data.name,
        email=employee_data.email,
        department=employee_data.department,
        designation=employee_data.designation,
        attendance=employee_data.attendance,
        status=employee_data.status,
        company_id=company_id


    )

    db.add(new_employee)

    db.commit()

    db.refresh(new_employee)

    return {
        "success": True,
        "message": "Employee added successfully",
        "data": new_employee
    }




    # DELETE EMPLOYEE

def delete_employee(db: Session, employee_id: int):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        return None

    db.delete(employee)

    db.commit()

    return employee

    return new_employee

# UPDATE EMPLOYEE STATUS

def update_employee_status(
    db: Session,
    employee_id: int,
    status: str
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        return None

    employee.status = status

    db.commit()

    db.refresh(employee)

    return employee

# UPDATE EMPLOYEE

def update_employee(
    db: Session,
    employee_id: int,
    employee_data
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        return None

    employee.name = employee_data.name

    employee.email = employee_data.email

    employee.department = employee_data.department

    employee.designation = employee_data.designation

    employee.attendance = employee_data.attendance

    employee.status = employee_data.status

    db.commit()

    db.refresh(employee)

    return employee