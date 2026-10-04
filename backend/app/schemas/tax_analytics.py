from pydantic import BaseModel
from typing import List


class TaxAnalyticsMatch(BaseModel):
    symbol: str
    buy_date: str
    sell_date: str
    quantity: float
    currency: str

    buy_price: float
    sell_price: float

    buy_amount: float
    sell_amount: float

    buy_fx_rate: float
    buy_fx_date: str
    buy_fx_source: str

    sell_fx_rate: float
    sell_fx_date: str
    sell_fx_source: str

    cost_basis_inr: float
    sale_value_inr: float
    gain_loss_inr: float

    holding_days: int
    classification: str


class TaxAnalyticsResponse(BaseModel):
    total_cost_basis_inr: float
    total_sale_value_inr: float
    net_gain_loss_inr: float

    total_gains_inr: float
    total_losses_inr: float

    short_term_gain_inr: float
    short_term_loss_inr: float

    long_term_gain_inr: float
    long_term_loss_inr: float

    foreign_dividend_income: float
    foreign_tax_paid: float

    matched_transactions: int

    matches: List[TaxAnalyticsMatch]

    notes: List[str]