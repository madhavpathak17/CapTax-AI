from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas.capital_gains import CapitalGainsResponse
from app.services.capital_gains_service import (
    calculate_user_capital_gains,
)


router = APIRouter(
    prefix="/capital-gains",
    tags=["Capital Gains"],
)


@router.get(
    "/summary",
    response_model=CapitalGainsResponse,
)
def get_capital_gains_summary(
    current_user: dict = Depends(get_current_user),
):
    return calculate_user_capital_gains(
        user_id=current_user["_id"]
    )