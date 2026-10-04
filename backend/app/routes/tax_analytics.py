from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.auth import get_current_user
from app.schemas.tax_analytics import TaxAnalyticsResponse
from app.services.tax_analytics_service import (
    calculate_tax_analytics,
)


router = APIRouter(
    prefix="/tax-analytics",
    tags=["Tax Analytics"],
)


@router.get(
    "/summary",
    response_model=TaxAnalyticsResponse,
)
def get_tax_analytics(
    current_user: dict = Depends(get_current_user),
):
    try:
        return calculate_tax_analytics(
            current_user["_id"]
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to calculate tax analytics: {error}",
        )