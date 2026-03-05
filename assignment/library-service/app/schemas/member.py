from pydantic import BaseModel, EmailStr
from typing import Optional

class MemberCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class MemberUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]

class MemberResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str]

    class Config:
        from_attributes = True