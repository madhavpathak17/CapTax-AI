from datetime import datetime, date
from decimal import Decimal, ROUND_HALF_UP

from app.database.connection import get_database
from app.services.fx_service import convert_to_inr


def _money(value):
    return Decimal(str(value)).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )


def _date_string(value):
    if isinstance(value, datetime):
        return value.date().isoformat()

    if isinstance(value, date):
        return value.isoformat()

    return str(value)[:10]


def _holding_days(buy_date, sell_date):
    buy = datetime.fromisoformat(_date_string(buy_date))
    sell = datetime.fromisoformat(_date_string(sell_date))
    return (sell - buy).days


def _get_fifo_matches(user_id):
    """
    Perform FIFO matching directly from the user's transactions.

    This keeps Tax Analytics independent from the presentation layer
    of the existing Capital Gains endpoint while using the same FIFO
    business rule.
    """

    database = get_database()

    transactions = list(
        database["transactions"]
        .find({"user_id": user_id})
        .sort([
            ("date", 1),
            ("_id", 1),
        ])
    )

    lots = {}
    matches = []

    for transaction in transactions:
        symbol = transaction["symbol"]
        transaction_type = transaction["transaction_type"]

        if symbol not in lots:
            lots[symbol] = []

        if transaction_type == "BUY":
            lots[symbol].append(
                {
                    "transaction_id": str(transaction["_id"]),
                    "date": transaction["date"],
                    "quantity": Decimal(str(transaction["quantity"])),
                    "price": Decimal(str(transaction["price"])),
                    "currency": transaction["currency"],
                }
            )

        elif transaction_type == "SELL":
            remaining_quantity = Decimal(
                str(transaction["quantity"])
            )

            while remaining_quantity > 0 and lots[symbol]:
                buy_lot = lots[symbol][0]

                matched_quantity = min(
                    remaining_quantity,
                    buy_lot["quantity"],
                )

                holding_days = _holding_days(
                    buy_lot["date"],
                    transaction["date"],
                )

                matches.append(
                    {
                        "symbol": symbol,
                        "buy_date": buy_lot["date"],
                        "sell_date": transaction["date"],
                        "quantity": matched_quantity,
                        "buy_price": buy_lot["price"],
                        "sell_price": Decimal(
                            str(transaction["price"])
                        ),
                        "currency": transaction["currency"],
                        "buy_transaction_id": buy_lot[
                            "transaction_id"
                        ],
                        "sell_transaction_id": str(
                            transaction["_id"]
                        ),
                        "holding_days": holding_days,
                        "classification": (
                            "LONG_TERM"
                            if holding_days >= 365
                            else "SHORT_TERM"
                        ),
                    }
                )

                buy_lot["quantity"] -= matched_quantity
                remaining_quantity -= matched_quantity

                if buy_lot["quantity"] <= 0:
                    lots[symbol].pop(0)

            # If a sell exceeds available FIFO lots, the unmatched
            # quantity is ignored for realized-gain calculation.
            # This prevents creating artificial cost basis.

    return matches


def calculate_tax_analytics(user_id):
    matches = _get_fifo_matches(user_id)

    detailed_matches = []

    total_cost_basis_inr = Decimal("0")
    total_sale_value_inr = Decimal("0")

    short_term_gain_inr = Decimal("0")
    short_term_loss_inr = Decimal("0")

    long_term_gain_inr = Decimal("0")
    long_term_loss_inr = Decimal("0")

    for match in matches:
        quantity = match["quantity"]
        buy_price = match["buy_price"]
        sell_price = match["sell_price"]
        currency = match["currency"]

        buy_amount = quantity * buy_price
        sell_amount = quantity * sell_price

        buy_fx = convert_to_inr(
            amount=buy_amount,
            currency=currency,
            transaction_date=match["buy_date"],
        )

        sell_fx = convert_to_inr(
            amount=sell_amount,
            currency=currency,
            transaction_date=match["sell_date"],
        )

        cost_basis_inr = _money(
            buy_fx["inr_amount"]
        )

        sale_value_inr = _money(
            sell_fx["inr_amount"]
        )

        gain_loss_inr = _money(
            sale_value_inr - cost_basis_inr
        )

        total_cost_basis_inr += cost_basis_inr
        total_sale_value_inr += sale_value_inr

        if match["classification"] == "LONG_TERM":
            if gain_loss_inr >= 0:
                long_term_gain_inr += gain_loss_inr
            else:
                long_term_loss_inr += abs(gain_loss_inr)
        else:
            if gain_loss_inr >= 0:
                short_term_gain_inr += gain_loss_inr
            else:
                short_term_loss_inr += abs(gain_loss_inr)

        detailed_matches.append(
            {
                "symbol": match["symbol"],
                "buy_date": _date_string(
                    match["buy_date"]
                ),
                "sell_date": _date_string(
                    match["sell_date"]
                ),
                "quantity": float(quantity),
                "currency": currency,
                "buy_price": float(buy_price),
                "sell_price": float(sell_price),
                "buy_amount": float(
                    _money(buy_amount)
                ),
                "sell_amount": float(
                    _money(sell_amount)
                ),
                "buy_fx_rate": float(
                    buy_fx["rate"]
                ),
                "buy_fx_date": buy_fx["rate_date"],
                "buy_fx_source": buy_fx["source"],
                "sell_fx_rate": float(
                    sell_fx["rate"]
                ),
                "sell_fx_date": sell_fx["rate_date"],
                "sell_fx_source": sell_fx["source"],
                "cost_basis_inr": float(
                    cost_basis_inr
                ),
                "sale_value_inr": float(
                    sale_value_inr
                ),
                "gain_loss_inr": float(
                    gain_loss_inr
                ),
                "holding_days": match[
                    "holding_days"
                ],
                "classification": match[
                    "classification"
                ],
            }
        )

    net_gain_loss_inr = _money(
        total_sale_value_inr
        - total_cost_basis_inr
    )

    database = get_database()

    foreign_asset_summary = list(
        database["foreign_assets"].aggregate(
            [
                {
                    "$match": {
                        "user_id": user_id
                    }
                },
                {
                    "$group": {
                        "_id": None,
                        "dividend_income": {
                            "$sum": {
                                "$ifNull": [
                                    "$dividend_income",
                                    0,
                                ]
                            }
                        },
                        "foreign_tax_paid": {
                            "$sum": {
                                "$ifNull": [
                                    "$tax_paid",
                                    0,
                                ]
                            }
                        },
                    }
                },
            ]
        )
    )

    dividend_income = Decimal("0")
    foreign_tax_paid = Decimal("0")

    if foreign_asset_summary:
        dividend_income = _money(
            foreign_asset_summary[0].get(
                "dividend_income", 0
            )
        )

        foreign_tax_paid = _money(
            foreign_asset_summary[0].get(
                "foreign_tax_paid", 0
            )
        )

    return {
        "total_cost_basis_inr": float(
            _money(total_cost_basis_inr)
        ),
        "total_sale_value_inr": float(
            _money(total_sale_value_inr)
        ),
        "net_gain_loss_inr": float(
            net_gain_loss_inr
        ),
        "total_gains_inr": float(
            _money(
                short_term_gain_inr
                + long_term_gain_inr
            )
        ),
        "total_losses_inr": float(
            _money(
                short_term_loss_inr
                + long_term_loss_inr
            )
        ),
        "short_term_gain_inr": float(
            _money(short_term_gain_inr)
        ),
        "short_term_loss_inr": float(
            _money(short_term_loss_inr)
        ),
        "long_term_gain_inr": float(
            _money(long_term_gain_inr)
        ),
        "long_term_loss_inr": float(
            _money(long_term_loss_inr)
        ),
        "foreign_dividend_income": float(
            dividend_income
        ),
        "foreign_tax_paid": float(
            foreign_tax_paid
        ),
        "matched_transactions": len(
            detailed_matches
        ),
        "matches": detailed_matches,
        "notes": [
            "Capital gains are converted to INR using historical FX rates for the respective buy and sell dates.",
            "FIFO matching is used for realized transactions.",
            "Holding-period classification is configurable and is currently represented using a 365-day academic threshold.",
            "This module provides tax-analysis assistance and does not constitute professional tax, legal, or financial advice.",
        ],
    }