
from pydantic import BaseModel
from datetime import datetime

class BorrowResponse(BaseModel):
    id: str
    book_id: str
    member_id: str
    borrowed_at: datetime
    due_date: datetime
    returned_at: datetime | None

    class Config:
        orm_mode = True
