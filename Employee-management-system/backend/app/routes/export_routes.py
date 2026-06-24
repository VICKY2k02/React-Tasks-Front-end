from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from openpyxl import Workbook
from reportlab.pdfgen import canvas
from app.shared_data import (
    notifications,
    audit_logs,
    leave_requests,
    attendance_access_requests
)


import csv
import io
from datetime import datetime



from app.database.connection import SessionLocal
from app.models.employee_model import Employee
from app.models.attendance_request import AttendanceAccessRequest
from app.models.leave_request import LeaveRequest
from app.models.audit_log import AuditLog
from app.models.notification import Notification
from app.models.export_history import ExportHistory

# auth_routes nundi users list import chestunnav ani assume chestunna
from app.routes.auth_routes import users

router = APIRouter(prefix="/exports", tags=["Exports"])


# -------------------------------
# DB Dependency
# -------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------------
# Request Schema
# -------------------------------
class ExportRequest(BaseModel):
    data: str
    format: str = "csv"


# -------------------------------
# Mock Current User
# -------------------------------
def get_current_user(user_email: str = Header(...)):
    for user in users:
        if user["email"] == user_email:
            return user

    raise HTTPException(
        status_code=401,
        detail="User not found"
    )

def admin_required(user):
    if user["role"].lower() != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")


# -------------------------------
# POST /exports
# -------------------------------
@router.post("")
def export_data(
    payload: ExportRequest,
    db: Session = Depends(get_db),
    user_email: str = Header(...)
):
    current_user = get_current_user(user_email)
    print(current_user)
    admin_required(current_user)

    export_type = payload.data
    export_format = payload.format.lower()
    company_id = current_user["company_id"]

    # ---------------------------
    # Company Scoped Queries
    # ---------------------------
    if export_type == "employees":
        records = db.query(Employee).filter(
            Employee.company_id == company_id
        ).all()

    elif export_type == "attendance":
        records = db.query(Employee).filter(
            Employee.company_id == company_id
        ).all()

        print("Attendance Count:", len(records))

    elif export_type == "leave_requests":
        records = db.query(LeaveRequest).filter(
            LeaveRequest.company_id == company_id
        ).all()

    elif export_type == "audit_logs":
        records = db.query(AuditLog).filter(
            AuditLog.company_id == company_id
        ).all()

        print("EXPORT TYPE:", export_type)
        print("RECORD COUNT:", len(records))
        print(records)

    elif export_type == "notifications":
        records = [
            n for n in notifications
            if n.get("company_id") == company_id
        ]

        print("EXPORT TYPE:", export_type)
        print("RECORD COUNT:", len(records))
        print(records)

    
    elif export_type == "analytics":
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

        pending_leave_requests = len([
            req for req in leave_requests
            if req["status"] == "Pending"
            and req["company_id"] == company_id
        ])

        pending_attendance_requests = len([
            req for req in attendance_access_requests
            if req["status"] == "Pending"
            and req["company_id"] == company_id
        ])

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

        analytics_data = {
            "Total Employees": total_employees,
            "Active Employees": active_employees,
            "Departments": departments,
            "Pending Requests": (
                pending_leave_requests +
                pending_attendance_requests
            ),
            "Admin Count": admin_count,
            "User Count": user_count
        }

        records = [analytics_data]
        print("EXPORT TYPE:", export_type)
        print("RECORD COUNT:", len(records))
        print(records)

    else:
        raise HTTPException(status_code=400, detail="Invalid export type")

    # ---------------------------
    # Save Export History
    # ---------------------------
    history = ExportHistory(
        company_id=company_id,
        exported_by=current_user["email"],
        data_type=export_type,
        export_format=export_format,
        exported_at=datetime.utcnow()
    )

    db.add(history)
    db.commit()

    # ---------------------------
    # CSV Export
    # ---------------------------
    if export_format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)

        if export_type == "analytics":
            writer.writerow(["Metric", "Value"])

            for key, value in records[0].items():
                writer.writerow([key, value])

        elif records:
            first_record = records[0]

            if isinstance(records[0], dict):
                columns = list(records[0].keys())
                ws.append(columns)

                for row in records:
                    ws.append([row[col] for col in columns])
            else:
                columns = records[0].__table__.columns.keys()
                get_value = lambda row, col: getattr(row, col)

            writer.writerow(columns)

            for row in records:
                writer.writerow([get_value(row, col) for col in columns])

        output.seek(0)

        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename={export_type}.csv"
            }
        )

    elif export_format == "excel":
        wb = Workbook()
        ws = wb.active
        ws.title = export_type

        if export_type == "analytics":
            ws.append(["Metric", "Value"])

            for key, value in records[0].items():
                ws.append([key, value])

        elif records:
            first_record = records[0]

            if isinstance(first_record, dict):
                columns = list(first_record.keys())
                get_value = lambda row, col: row.get(col)
            else:
                columns = first_record.__table__.columns.keys()
                get_value = lambda row, col: getattr(row, col)

            ws.append(list(columns))

            for row in records:
                ws.append([
                    get_value(row, col)
                    for col in columns
                ])

        output = io.BytesIO()
        wb.save(output)
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition":
                f"attachment; filename={export_type}.xlsx"
            }
        )



    elif export_format == "pdf":
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)

        y = 800

        if export_type == "analytics":
            p.setFont("Helvetica-Bold", 14)
            p.drawString(100, y, "Metric")
            p.drawString(300, y, "Value")
            y -= 30

            # Data normal
            p.setFont("Helvetica", 12)

            for key, value in records[0].items():
                p.drawString(100, y, str(key))
                p.drawString(300, y, str(value))
                y -= 25

                if y < 50:
                    p.showPage()
                    y = 800

        elif records:
            first_record = records[0]

            if isinstance(first_record, dict):
                columns = list(first_record.keys())
                get_value = lambda row, col: row.get(col)
            else:
                columns = first_record.__table__.columns.keys()
                get_value = lambda row, col: getattr(row, col)

            # Header
            header = " | ".join(columns)
            p.drawString(20, y, header)
            y -= 30

            # Rows
            for row in records:
                line = " | ".join(
                    str(get_value(row, col))
                    for col in columns
                )

                p.drawString(20, y, line)
                y -= 20

                if y < 50:
                    p.showPage()
                    y = 800

        p.save()
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition":
                f"attachment; filename={export_type}.pdf"
            }
        )

# -------------------------------
# GET /exports/history
# -------------------------------

@router.get("/history")
def export_history(
    db: Session = Depends(get_db),
    user_email: str = Header(...)
):
    current_user = get_current_user(user_email)
    admin_required(current_user)

    history = (
        db.query(ExportHistory)
        .filter(
            ExportHistory.company_id ==
            current_user["company_id"]
        )
        .order_by(
            ExportHistory.exported_at.desc()
        )
        .all()
    )

    result = []

    for item in history:
        result.append({
            "id": item.id,
            "who_exported": item.exported_by,
            "when": item.exported_at.strftime("%Y-%m-%d %H:%M"),
            "what_data": item.data_type,
            "format": item.export_format
        })

    return result



@router.delete("/clear")
def clear_export_history(
    db: Session = Depends(get_db),
    user_email: str = Header(...)
):
    current_user = get_current_user(user_email)
    admin_required(current_user)

    db.query(ExportHistory).filter(
        ExportHistory.company_id == current_user["company_id"]
    ).delete()

    db.commit()

    return {
        "message": "Export history cleared successfully"
    }