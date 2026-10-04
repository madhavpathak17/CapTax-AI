from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from app.dependencies.auth import (
    get_current_user,
)

from app.schemas.fx import (
    FXConversionRequest,
    FXConversionResponse,
)

from app.services.fx_service import (
    convert_to_inr,
)


router = APIRouter(
    prefix="/fx",
    tags=["Foreign Exchange"],
)


@router.post(
    "/convert-to-inr",
    response_model=FXConversionResponse,
)
def convert_currency_to_inr(
    request: FXConversionRequest,
    current_user: dict = Depends(
        get_current_user
    ),
):

    try:

        result = convert_to_inr(
            amount=request.amount,
            currency=request.currency,
            transaction_date=request.date,
        )

        return {
            "original_amount": float(
                result[
                    "original_amount"
                ]
            ),

            "original_currency":
                result[
                    "original_currency"
                ],

            "inr_amount": float(
                result[
                    "inr_amount"
                ]
            ),

            "rate": float(
                result["rate"]
            ),

            "rate_date":
                result["rate_date"],

            "source":
                result["source"],
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to retrieve "
                f"exchange rate: {error}"
            ),
        )