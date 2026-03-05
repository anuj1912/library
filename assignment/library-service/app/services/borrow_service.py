
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.book import Book
from app.models.borrow import BorrowRecord

class BorrowService:

    @staticmethod
    def borrow_book(db: Session, book_id: str, member_id: str):
        book = db.query(Book).filter(Book.id == book_id).first()

        if not book:
            raise HTTPException(status_code=404, detail="Book not found")

        if book.available_copies <= 0:
            raise HTTPException(status_code=400, detail="Book not available")

        record = BorrowRecord(
            book_id=book_id,
            member_id=member_id,
            due_date=datetime.utcnow() + timedelta(days=14)
        )

        book.available_copies -= 1

        db.add(record)
        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def return_book(db: Session, record_id: str):
        record = db.query(BorrowRecord).filter(BorrowRecord.id == record_id).first()

        if not record:
            raise HTTPException(status_code=404, detail="Borrow record not found")

        if record.returned_at:
            raise HTTPException(status_code=400, detail="Book already returned")

        record.returned_at = datetime.utcnow()

        book = db.query(Book).filter(Book.id == record.book_id).first()
        book.available_copies += 1

        db.commit()
        return record
