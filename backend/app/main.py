from app.routes.auth import router as auth_router

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database.connection import (
    connect_to_database,
    check_database_connection,
)

from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        connect_to_database()
        print("Database startup check passed.")
    except Exception as e:
        print(f"Database connection failed: {e}")

    yield


app = FastAPI(
    title="CapTax AI API",
    description="Multi-Broker Capital Gains & Foreign Asset Tax Disclosure Engine",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "CapTax AI API is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    database_status = check_database_connection()

    return {
        "status": "healthy",
        "service": "CapTax AI API",
        "database": "connected" if database_status else "disconnected",
    }