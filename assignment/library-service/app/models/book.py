
import uuid
from sqlalchemy import Column, String, Integer, DateTime
from typing import Optional
from pydantic import BaseModel, Field
from sqlalchemy.sql import func
from app.models.base import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    isbn = Column(String(50), unique=True)
    total_copies = Column(Integer, default=1)
    available_copies = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

