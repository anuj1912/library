from pydantic import BaseModel, Field
from typing import Optional

class BookCreate(BaseModel):
    title: str
    author: str
    isbn: str | None = None
    total_copies: int = 1

class BookResponse(BaseModel):
    id: str
    title: str
    author: str
    isbn: str | None
    total_copies: int
    available_copies: int

    class Config:
        orm_mode = True


class BookCreate(BaseModel):
    title: str = Field(..., min_length=1)
    author: str = Field(..., min_length=1)
    isbn: Optional[str] = None
    total_copies: int = Field(..., gt=0)

class BookUpdate(BaseModel):
    title: Optional[str]
    author: Optional[str]
    isbn: Optional[str]
    total_copies: Optional[int] = Field(None, gt=0)

class BookResponse(BaseModel):
    id: str
    title: str
    author: str
    isbn: Optional[str]
    total_copies: int
    available_copies: int

    class Config:
        from_attributes = True
