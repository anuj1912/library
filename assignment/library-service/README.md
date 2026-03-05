
# Neighborhood Library Service

## Overview
A RESTful backend service built with FastAPI and SQLite to manage:
- Books
- Members
- Borrowing & Returning operations

## Architecture
- Layered architecture (API → Service → Models)
- SQLite database (portable for assignment review)
- UUID-based identifiers
- Foreign key enforcement enabled

## Setup Instructions

### 1. Create Virtual Environment
python -m venv venv
source venv/bin/activate  (Linux/Mac)
venv\Scripts\activate    (Windows)

### 2. Install Dependencies+-*
pip install -r requirements.txt

### 3. Run Server
uvicorn app.main:app --reload

### 4. API Docs
http://localhost:8000/docs

## Design Notes
- SQLite chosen for evaluator convenience (no external DB setup required).
- Architecture is database-agnostic and can be switched to PostgreSQL via DATABASE_URL.
- Borrow logic enforces availability validation.
- Foreign keys enforced using PRAGMA in SQLite.

## Future Improvements
- Pagination & filtering
- JWT authentication
- Fine calculation for overdue books
- Alembic migrations
- Unit testing with pytest
