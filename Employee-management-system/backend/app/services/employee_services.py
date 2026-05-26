from sqlalchemy.orm import Session

from app.models.employee_model import Employee


# GET ALL EMPLOYEES

def get_all_employees(db: Session):

    employees = db.query(Employee).all()

    return employees


# CREATE EMPLOYEE

def create_employee(db: Session, employee):

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

