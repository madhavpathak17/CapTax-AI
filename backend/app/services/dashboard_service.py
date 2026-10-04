from bson import ObjectId

from app.services.capital_gains_service import (
    calculate_user_capital_gains,
)

from app.services.foreign_asset_service import (
    get_foreign_asset_summary,
)

from app.services.transaction_service import (
    get_user_transactions,
)


def get_dashboard_summary(
    user_id: ObjectId,
):
    transactions = get_user_transactions(
        user_id
    )

    capital_gains = calculate_user_capital_gains(
        user_id
    )

    foreign_assets = get_foreign_asset_summary(
        user_id
    )

    buy_transactions = sum(
        1
        for transaction in transactions
        if transaction["transaction_type"] == "BUY"
    )

    sell_transactions = sum(
        1
        for transaction in transactions
        if transaction["transaction_type"] == "SELL"
    )

    return {
        "total_transactions": len(
            transactions
        ),

        "buy_transactions": buy_transactions,

        "sell_transactions": sell_transactions,

        "net_gain_loss": capital_gains[
            "net_gain_loss"
        ],

        "total_gain": capital_gains[
            "total_gain"
        ],

        "total_loss": capital_gains[
            "total_loss"
        ],

        "short_term_gain": capital_gains[
            "short_term_gain"
        ],

        "long_term_gain": capital_gains[
            "long_term_gain"
        ],

        "foreign_asset_count": foreign_assets[
            "total_assets"
        ],

        "foreign_current_value": foreign_assets[
            "total_current_value"
        ],

        "foreign_peak_value": foreign_assets[
            "total_peak_value"
        ],

        "foreign_dividend_income": foreign_assets[
            "total_dividend_income"
        ],

        "foreign_tax_paid": foreign_assets[
            "total_foreign_tax_paid"
        ],

        "remaining_holdings": len(
            capital_gains[
                "remaining_holdings"
            ]
        ),
    }