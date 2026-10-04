from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ForeignAssetCreate(BaseModel):
    asset_name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    asset_type: str = Field(
        ...,
        min_length=2,
        max_length=50,
    )

    country: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    institution: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    currency: str = Field(
        ...,
        min_length=3,
        max_length=10,
    )

    acquisition_date: datetime

    peak_value: float = Field(
        ...,
        ge=0,
    )

    current_value: float = Field(
        ...,
        ge=0,
    )

    dividend_income: float = Field(
        default=0,
        ge=0,
    )

    foreign_tax_paid: float = Field(
        default=0,
        ge=0,
    )


class ForeignAssetResponse(BaseModel):
    id: str

    asset_name: str
    asset_type: str
    country: str
    institution: str
    currency: str

    acquisition_date: datetime

    peak_value: float
    current_value: float

    dividend_income: float
    foreign_tax_paid: float

    created_at: datetime


class ForeignAssetSummary(BaseModel):
    total_assets: int

    total_current_value: float
    total_peak_value: float

    total_dividend_income: float
    total_foreign_tax_paid: float

    assets: list[ForeignAssetResponse]