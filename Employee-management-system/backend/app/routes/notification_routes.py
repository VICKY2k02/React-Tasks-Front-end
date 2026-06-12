from fastapi import APIRouter
from app.shared_data import ( notifications, reactivation_requests)

router = APIRouter()

@router.get("/notifications")
def get_notifications():
    return notifications


@router.put("/notifications/read-all")
def mark_all_read():

    notifications.clear()

    reactivation_requests.clear()

    return {
        "message":
        "All notifications cleared"
    }