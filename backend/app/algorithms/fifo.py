from collections import defaultdict
from datetime import datetime


DEFAULT_LONG_TERM_DAYS = 365


def calculate_fifo(
    transactions: list[dict],
    long_term_days: int = DEFAULT_LONG_TERM_DAYS,
):
    """
    Match SELL transactions against previous BUY transactions
    using the FIFO (First In, First Out) method.

    Returns:
        {
            "matches": [...],
            "remaining_holdings": [...],
        }
    """

    grouped_transactions = defaultdict(list)

    for transaction in transactions:
        grouped_transactions[
            transaction["symbol"]
        ].append(transaction)

    matches = []
    remaining_holdings = []

    for symbol, symbol_transactions in grouped_transactions.items():

        symbol_transactions.sort(
            key=lambda transaction: transaction["date"]
        )

        buy_lots = []

        for transaction in symbol_transactions:

            transaction_type = transaction["transaction_type"]

            if transaction_type == "BUY":

                buy_lots.append(
                    {
                        "transaction_id": transaction["id"],
                        "date": transaction["date"],
                        "quantity": float(transaction["quantity"]),
                        "remaining_quantity": float(
                            transaction["quantity"]
                        ),
                        "price": float(transaction["price"]),
                        "currency": transaction["currency"],
                        "broker": transaction["broker"],
                    }
                )

            elif transaction_type == "SELL":

                sell_quantity = float(transaction["quantity"])
                sell_price = float(transaction["price"])
                sell_date = transaction["date"]

                while sell_quantity > 0 and buy_lots:

                    oldest_lot = buy_lots[0]

                    available_quantity = oldest_lot[
                        "remaining_quantity"
                    ]

                    matched_quantity = min(
                        sell_quantity,
                        available_quantity,
                    )

                    buy_date = oldest_lot["date"]

                    holding_days = (
                        sell_date - buy_date
                    ).days

                    cost_basis = (
                        matched_quantity
                        * oldest_lot["price"]
                    )

                    sale_value = (
                        matched_quantity
                        * sell_price
                    )

                    gain_loss = (
                        sale_value
                        - cost_basis
                    )

                    classification = (
                        "LONG_TERM"
                        if holding_days >= long_term_days
                        else "SHORT_TERM"
                    )

                    matches.append(
                        {
                            "symbol": symbol,
                            "buy_date": buy_date,
                            "sell_date": sell_date,
                            "quantity": matched_quantity,
                            "buy_price": oldest_lot["price"],
                            "sell_price": sell_price,
                            "currency": transaction["currency"],
                            "cost_basis": round(
                                cost_basis,
                                2,
                            ),
                            "sale_value": round(
                                sale_value,
                                2,
                            ),
                            "gain_loss": round(
                                gain_loss,
                                2,
                            ),
                            "holding_days": holding_days,
                            "classification": classification,
                            "buy_transaction_id": oldest_lot[
                                "transaction_id"
                            ],
                            "sell_transaction_id": transaction[
                                "id"
                            ],
                        }
                    )

                    oldest_lot[
                        "remaining_quantity"
                    ] -= matched_quantity

                    sell_quantity -= matched_quantity

                    if oldest_lot[
                        "remaining_quantity"
                    ] <= 0.0000001:

                        buy_lots.pop(0)

                if sell_quantity > 0:

                    matches.append(
                        {
                            "symbol": symbol,
                            "buy_date": None,
                            "sell_date": sell_date,
                            "quantity": sell_quantity,
                            "buy_price": 0,
                            "sell_price": sell_price,
                            "currency": transaction["currency"],
                            "cost_basis": 0,
                            "sale_value": round(
                                sell_quantity * sell_price,
                                2,
                            ),
                            "gain_loss": round(
                                sell_quantity * sell_price,
                                2,
                            ),
                            "holding_days": 0,
                            "classification": "UNMATCHED",
                            "buy_transaction_id": None,
                            "sell_transaction_id": transaction[
                                "id"
                            ],
                        }
                    )

        for lot in buy_lots:

            if lot["remaining_quantity"] > 0:

                remaining_holdings.append(
                    {
                        "symbol": symbol,
                        "buy_date": lot["date"],
                        "quantity": round(
                            lot["remaining_quantity"],
                            8,
                        ),
                        "buy_price": lot["price"],
                        "currency": lot["currency"],
                        "broker": lot["broker"],
                        "cost_basis": round(
                            lot["remaining_quantity"]
                            * lot["price"],
                            2,
                        ),
                        "transaction_id": lot[
                            "transaction_id"
                        ],
                    }
                )

    return {
        "matches": matches,
        "remaining_holdings": remaining_holdings,
    }