from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TransactionResponse(BaseModel):
    id: str
    date: datetime
    symbol: str
    asset_type: str
    transaction_type: str
    quantity: float
    price: float
    currency: str
    broker: str
    total_value: float


class TransactionUploadResponse(BaseModel):
    message: str
    inserted_count: int
    skipped_count: int