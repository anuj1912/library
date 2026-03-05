
from fastapi import APIRouter, Depends
from typing import List
from app.schemas.borrow import BorrowResponse
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.borrow_service import BorrowService
from app.models.borrow import BorrowRecord



router = APIRouter(prefix="/borrow", tags=["Borrow"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/{book_id}/{member_id}")
def borrow_book(book_id: str, member_id: str, db: Session = Depends(get_db)):
    return BorrowService.borrow_book(db, book_id, member_id)

@router.put("/return/{record_id}")
def return_book_put(record_id: str, db: Session = Depends(get_db)):
    """REST-friendly alias for returning a borrowed book."""
    return BorrowService.return_book(db, record_id)

@router.post("/return/{record_id}")
def return_book(record_id: str, db: Session = Depends(get_db)):
    return BorrowService.return_book(db, record_id)

@router.get("/")
def list_borrow_records(db: Session = Depends(get_db)):
    return db.query(BorrowRecord).all()


@router.get("/member/{member_id}", response_model=List[BorrowResponse])
def list_member_borrows(member_id: str, db: Session = Depends(get_db)):
    return db.query(BorrowRecord).filter(
        BorrowRecord.member_id == member_id,
        BorrowRecord.returned_at.is_(None)
    ).all()