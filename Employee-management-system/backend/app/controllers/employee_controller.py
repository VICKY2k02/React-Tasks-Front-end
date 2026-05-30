# from app.database.employee_database import employees


# def get_all_employees():
#     return {
#         "success": True,
#         "count": len(employees),
#         "data": employees
#     }


# def get_employee_by_id(employee_id: int):
#     employee = next(
#         (emp for emp in employees if emp["id"] == employee_id),
#         None
#     )

#     if employee:
#         return {
#             "success": True,
#             "data": employee
#         }

#     return {
#         "success": False,
#         "message": "Employee not found"
#     }
