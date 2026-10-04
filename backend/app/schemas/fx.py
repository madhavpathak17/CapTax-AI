from pydantic import BaseModel, Field


class FXConversionRequest(BaseModel):
    amount: float = Field(
        ...,
        gt=0,
    )

    currency: str = Field(
        ...,
        min_length=3,
        max_length=3,
    )

    date: str


class FXConversionResponse(BaseModel):
    original_amount: float
    original_currency: str

    inr_amount: float

    rate: float

    rate_date: str

    source: str