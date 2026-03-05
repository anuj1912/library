# Library Service Frontend (React + Vite) 
# Frontend

Minimal UI for the Neighborhood Library backend (FastAPI) to:
- Create & list **Books**
- Create & list **Members**
- **Borrow** a book (creates a borrow record)
- **Return** a book (by borrow record id)

## Prerequisites
- Node.js 18+ (recommended)
- Backend running (from your `library-service` project)

## Configure API Base URL
Create `.env` in this folder (or edit the existing `.env.example`):

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

> Your backend routes are expected to be:
> - `POST /books/`, `GET /books/`
> - `POST /members/`, `GET /members/`
> - `POST /borrow/{book_id}/{member_id}`
> - `POST /borrow/return/{record_id}`

## Run
```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually http://127.0.0.1:5173).

## Notes
- Borrowing returns a `record_id` — you can use it to return the book.
- If you want "List borrowed books by member", add a backend endpoint like:
  - `GET /borrow?member_id=...` or `GET /members/{id}/borrowed`
  Then we can wire it up in the UI quickly.


# Library Service (BACKEND SERVICES API)


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
