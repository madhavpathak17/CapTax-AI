from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import (
    connect_to_database,
    check_database_connection,
)

from app.routes.auth import (
    router as auth_router,
)

from app.routes.transactions import (
    router as transactions_router,
)

from app.routes.capital_gains import (
    router as capital_gains_router,
)

from app.routes.foreign_assets import (
    router as foreign_assets_router,
)

from app.routes.dashboard import (
    router as dashboard_router,
)

from app.routes.fx import (
    router as fx_router,
)

from app.routes.tax_analytics import (
    router as tax_analytics_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        connect_to_database()
        print("Database startup check passed.")
    except Exception as error:
        print(
            f"Database connection failed: {error}"
        )

    yield


app = FastAPI(
    title="CapTax AI API",
    description=(
        "Multi-Broker Capital Gains & "
        "Foreign Asset Tax Disclosure Engine"
    ),
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
app.include_router(transactions_router)
app.include_router(capital_gains_router)
app.include_router(foreign_assets_router)
app.include_router(dashboard_router)
app.include_router(fx_router)
app.include_router(tax_analytics_router)


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
        "database": (
            "connected"
            if database_status
            else "disconnected"
        ),
    }