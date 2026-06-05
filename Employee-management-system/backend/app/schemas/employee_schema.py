from pydantic import BaseModel

class EmployeeCreate(BaseModel):

    name: str
    email: str
    department: str
    designation: str
    attendance: str
    status: str


class EmployeeResponse(BaseModel):

    id: int
    name: str
    email: str
    department: str
    designation: str
    attendance: str
    status: str
    company_id: int


    class Config:
        from_attributes = True