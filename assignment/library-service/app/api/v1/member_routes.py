
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.member import Member
from app.schemas.member import MemberCreate

router = APIRouter(prefix="/members", tags=["Members"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_member(member: MemberCreate, db: Session = Depends(get_db)):
    db_member = Member(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.get("/")
def list_members(db: Session = Depends(get_db)):
    return db.query(Member).all()

from fastapi import HTTPException
from app.schemas.member import MemberUpdate

@router.get("/{member_id}")
def get_member(member_id: str, db: Session = Depends(get_db)):
    db_member = db.query(Member).filter(Member.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    return db_member

@router.put("/{member_id}")
def update_member(member_id: str, member: MemberUpdate, db: Session = Depends(get_db)):
    db_member = db.query(Member).filter(Member.id == member_id).first()

    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")

    for key, value in member.dict(exclude_unset=True).items():
        setattr(db_member, key, value)

    db.commit()
    db.refresh(db_member)
    return db_member