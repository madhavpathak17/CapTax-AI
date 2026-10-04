from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_transactions: int

    buy_transactions: int
    sell_transactions: int

    net_gain_loss: float

    total_gain: float
    total_loss: float

    short_term_gain: float
    long_term_gain: float

    foreign_asset_count: int

    foreign_current_value: float
    foreign_peak_value: float

    foreign_dividend_income: float
    foreign_tax_paid: float

    remaining_holdings: int