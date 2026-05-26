from sqlalchemy.orm import Session
from app.models.employee_model import Employee


def get_all_employees(db: Session):
    return db.query(Employee).all()


def get_employee_by_id(
    db: Session,
    employee_id: int
):
    return db.query(Employee).filter(
        Employee.id == employee_id
    ).first()


def create_employee(
    db: Session,
    employee_data
):

    employee = Employee(
        name=employee_data.name,
        email=employee_data.email,
        department=employee_data.department,
        designation=employee_data.designation,
        status=employee_data.status
    )

    db.add(employee)

    db.commit()

    db.refresh(employee)

    return employee