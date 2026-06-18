from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.audit_log import AuditLog
from app.shared_data import (
    notifications,
    attendance_requests,
    attendance_access_requests,
    attendance_records,
    audit_logs
)
from app.routes.auth_routes import users


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# -----------------------------------
# GET ATTENDANCE ACCESS (AUTO REQUEST)
# -----------------------------------
@router.get("/attendance/access/{email}")
def get_access(email: str, db: Session = Depends(get_db)):

    user = next(
        (u for u in users if u["email"] == email),
        None
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # ADMINS ALWAYS HAVE ACCESS
    if user["role"] == "admin":
        return {
            "approved": True,
            "status": "Approved"
        }

    user.setdefault("attendance_access", False)
    user.setdefault("attendance_request_status", "Not Requested")
    user.setdefault("attendance_request_time", None)

    #  Already approved
    if user["attendance_access"]:
        return {"approved": True}

    # AUTO REQUEST ONLY ON FIRST VISIT
    if not user.get("attendance_request_time"):

        now = datetime.now().strftime("%d-%m-%Y %I:%M %p")

        user["attendance_request_status"] = "Pending"
        user["attendance_request_time"] = now

        request = {
            "user_name": user.get("name", user["email"]),
            "user_email": user["email"],
            "company_id": user["company_id"],
            "timestamp": now,
            "status": "Pending",
            "type": "attendance_access"
        }

        attendance_access_requests.append(request)

        audit = AuditLog(
            user_name=user.get("name", user["email"]),
            action="Attendance Access Requested",
            related_user=user["email"],
            company_id=user["company_id"]
        )

        db.add(audit)
        db.commit()

        #  COMPANY-BASED NOTIFICATION ONLY TO ADMINS
        for admin in users:
            if admin["role"] == "admin" and admin["company_id"] == user["company_id"]:
                notifications.append({
                    "id": len(notifications) + 1,
                    "recipient_email": admin["email"],   # NEW
                    "user_name": user.get("name", ""),
                    "user_email": user["email"],
                    "company_id": user["company_id"],
                    "type": "attendance_access",
                    "timestamp": now,
                    "status": "Pending",
                    "message": f"{user['email']} requested attendance access"
                })

    return {
        "approved": False,
        "status": user["attendance_request_status"],
        "submitted_on": user["attendance_request_time"]
    }


# -----------------------------------
# APPROVE ACCESS
# -----------------------------------
@router.put(
    "/attendance/approve/{email}"
)
def approve_access(email: str):

    user = next(
        (
            u for u in users
            if u["email"] == email
        ),
        None
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user["attendance_access"] = True

    user["attendance_request_status"] = "Approved"

    for req in attendance_access_requests:

        if req["user_email"] == email:

            req["status"] = "Approved"

    for n in notifications:

        if (
            n.get("user_email")
            == email
        ):
            n["status"] = "Approved"

    audit_logs.append({

        "action":
        "Attendance Access Approved",

        "email":
        email,

        "company_id":
        user["company_id"],

        "timestamp":
        datetime.now().isoformat()
    })

    return {
        "success": True
    }

# -----------------------------------
# REJECT ACCESS
# -----------------------------------

@router.put("/attendance/reject/{email}")
def reject_access(email: str):

    user = next(
        (
            u for u in users
            if u["email"] == email
        ),
        None
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user["attendance_access"] = False

    user["attendance_request_status"] = "Rejected"

    for req in attendance_access_requests:

        if req["user_email"] == email:

            req["status"] = "Rejected"

    for n in notifications:

        if (
            n.get("user_email")
            == email
        ):
            n["status"] = "Rejected"

    audit_logs.append({

        "action": "Attendance Access Rejected",

        "email": email,

        "company_id": user["company_id"],

        "timestamp": datetime.now().isoformat()
    })

    return {
        "success": True
    }

@router.get("/attendance/history/{email}")
def get_history(email: str):
    data = [
        a for a in attendance_records
        if a["email"] == email
    ]

    print("HISTORY DATA:", data)

    return data

@router.post("/attendance/checkin")
def checkin(data: dict, db: Session = Depends(get_db)):

    email = data["email"]
    user = next(u for u in users if u["email"] == email)

    for record in attendance_records:
        if (
            record["email"] == email and
            record["date"] == datetime.now().date().isoformat() and
            not record["check_out"]
        ):
            raise HTTPException(
                status_code=400,
                detail="Already checked in"
            )

    record = {
        "email": email,
        "company_id": user["company_id"],
        "check_in": datetime.now().isoformat(),
        "check_out": None,
        "hours": 0,
        "date": datetime.now().date().isoformat()
    }

    attendance_records.append(record)

    audit = AuditLog(
        user_name=user.get("name", email),
        action="Check-In",
        related_user=email,
        company_id=user["company_id"]
    )

    db.add(audit)
    db.commit()

    return record


@router.post("/attendance/checkout")
def checkout(data: dict , db: Session = Depends(get_db)):

    email = data["email"]

    for record in reversed(attendance_records):
        if record["email"] == email and not record["check_out"]:
            record["check_out"] = datetime.now().isoformat()

            # record["hours"] = "Calculated Later"
            checkin_time = datetime.fromisoformat(
                record["check_in"]
            )

            checkout_time = datetime.now()

            seconds = int(
                (checkout_time - checkin_time)
                .total_seconds()
            )

            record["hours"] = seconds

            audit = AuditLog(
                user_name=email,
                action="Check-Out",
                related_user=email,
                company_id=record["company_id"]
            )

            db.add(audit)
            db.commit()

            return record

    raise HTTPException(status_code=400, detail="No active check-in found")




@router.get(
    "/attendance/requests/{company_id}/{admin_email}"
)
def get_attendance_requests(
    company_id: int,
    admin_email: str
):

    admin = next(
        (
            u for u in users
            if u["email"] == admin_email
        ),
        None
    )

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found"
        )

    if admin["role"] != "admin":
        return []

    return [
        req
        for req in attendance_access_requests
        if req["company_id"] == company_id
        and req["status"] == "Pending"
    ]


@router.get("/attendance/today/{email}")
def get_today_attendance(email: str):
    today = datetime.now().date().isoformat()

    for record in reversed(attendance_records):
        if (
            record["email"] == email and
            record["date"] == today
        ):
            return record

    return {}




@router.get("/attendance/total-hours/{email}")
def get_total_hours(email: str):

    latest_record = None

    for record in reversed(attendance_records):
        if record["email"] == email:
            latest_record = record
            break

    if not latest_record:
        return {"total_hours": "00:00:00"}

    if not latest_record.get("check_out"):
        return {"total_hours": "00:00:00"}

    seconds = latest_record["hours"]

    hrs = seconds // 3600
    mins = (seconds % 3600) // 60
    secs = seconds % 60

    return {
        "total_hours": f"{hrs:02}:{mins:02}:{secs:02}"
    }