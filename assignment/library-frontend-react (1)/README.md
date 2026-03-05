# Library Service Frontend (React + Vite)

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
