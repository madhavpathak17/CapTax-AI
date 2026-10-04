from bson import ObjectId

from app.algorithms.fifo import calculate_fifo
from app.database.connection import get_database
from app.services.transaction_service import get_user_transactions


def calculate_user_capital_gains(
    user_id: ObjectId,
    long_term_days: int = 365,
):
    transactions = get_user_transactions(user_id)

    fifo_result = calculate_fifo(
        transactions=transactions,
        long_term_days=long_term_days,
    )

    matches = fifo_result["matches"]

    total_gain = 0.0
    total_loss = 0.0

    short_term_gain = 0.0
    short_term_loss = 0.0

    long_term_gain = 0.0
    long_term_loss = 0.0

    for match in matches:

        gain_loss = float(
            match["gain_loss"]
        )

        if gain_loss >= 0:
            total_gain += gain_loss
        else:
            total_loss += abs(gain_loss)

        if match["classification"] == "SHORT_TERM":

            if gain_loss >= 0:
                short_term_gain += gain_loss
            else:
                short_term_loss += abs(gain_loss)

        elif match["classification"] == "LONG_TERM":

            if gain_loss >= 0:
                long_term_gain += gain_loss
            else:
                long_term_loss += abs(gain_loss)

    net_gain_loss = (
        total_gain
        - total_loss
    )

    return {
        "total_gain": round(
            total_gain,
            2,
        ),
        "total_loss": round(
            total_loss,
            2,
        ),
        "net_gain_loss": round(
            net_gain_loss,
            2,
        ),
        "short_term_gain": round(
            short_term_gain,
            2,
        ),
        "short_term_loss": round(
            short_term_loss,
            2,
        ),
        "long_term_gain": round(
            long_term_gain,
            2,
        ),
        "long_term_loss": round(
            long_term_loss,
            2,
        ),
        "matched_transactions": len(
            matches
        ),
        "matches": matches,
        "remaining_holdings": fifo_result[
            "remaining_holdings"
        ],
    }