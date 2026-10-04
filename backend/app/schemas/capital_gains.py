from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CapitalGainMatch(BaseModel):
    symbol: str

    buy_date: Optional[datetime] = None
    sell_date: Optional[datetime] = None

    quantity: float

    buy_price: float
    sell_price: float

    currency: str

    cost_basis: float
    sale_value: float
    gain_loss: float

    holding_days: int

    classification: str

    buy_transaction_id: Optional[str] = None
    sell_transaction_id: Optional[str] = None


class RemainingHolding(BaseModel):
    symbol: str

    buy_date: datetime

    quantity: float
    buy_price: float

    currency: str
    broker: str

    cost_basis: float

    transaction_id: str


class CapitalGainsResponse(BaseModel):
    total_gain: float
    total_loss: float
    net_gain_loss: float

    short_term_gain: float
    short_term_loss: float

    long_term_gain: float
    long_term_loss: float

    matched_transactions: int

    matches: list[CapitalGainMatch]
    remaining_holdings: list[RemainingHolding]