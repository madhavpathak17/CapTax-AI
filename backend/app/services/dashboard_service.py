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

    # Group foreign-asset values by currency. Never combine USD, EUR, GBP, etc.
    # into a single total because those values are not directly comparable.
    currency_groups = {}
    for asset in foreign_assets.get("assets", []):
        currency = str(asset.get("currency") or "USD").upper()
        group = currency_groups.setdefault(
            currency,
            {
                "currency": currency,
                "current_value": 0.0,
                "peak_value": 0.0,
                "dividend_income": 0.0,
                "foreign_tax_paid": 0.0,
            },
        )
        group["current_value"] += float(asset.get("current_value") or 0)
        group["peak_value"] += float(asset.get("peak_value") or 0)
        group["dividend_income"] += float(asset.get("dividend_income") or 0)
        group["foreign_tax_paid"] += float(asset.get("foreign_tax_paid") or 0)

    foreign_currency_totals = []
    for currency in sorted(currency_groups):
        group = currency_groups[currency]
        foreign_currency_totals.append({
            key: (value if key == "currency" else round(value, 2))
            for key, value in group.items()
        })

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

        "foreign_currency_totals": foreign_currency_totals,

        "remaining_holdings": len(
            capital_gains[
                "remaining_holdings"
            ]
        ),
    }