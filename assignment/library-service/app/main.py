
from fastapi import FastAPI
from app.core.database import engine
from app.models.base import Base
from app.api.v1 import book_routes, member_routes, borrow_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Neighborhood Library Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],   # includes OPTIONS
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(book_routes.router)
app.include_router(member_routes.router)
app.include_router(borrow_routes.router)
