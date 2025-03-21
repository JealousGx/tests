from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.endpoints import router
from .database.db import engine
from .models.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")
