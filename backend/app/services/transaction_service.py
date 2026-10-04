from datetime import datetime, timezone
from io import BytesIO

import pandas as pd
from bson import ObjectId

from app.database.connection import get_database


REQUIRED_COLUMNS = {
    "date",
    "symbol",
    "asset_type",
    "transaction_type",
    "quantity",
    "price",
    "currency",
    "broker",
}


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = [
        str(column).strip().lower().replace(" ", "_")
        for column in df.columns
    ]

    return df


def parse_transaction_file(
    file_bytes: bytes,
    filename: str,
):
    extension = filename.lower().split(".")[-1]

    if extension == "csv":
        df = pd.read_csv(BytesIO(file_bytes))

    elif extension in {"xlsx", "xls"}:
        df = pd.read_excel(BytesIO(file_bytes))

    else:
        raise ValueError(
            "Unsupported file format. Please upload CSV or Excel."
        )

    if df.empty:
        raise ValueError("The uploaded file contains no transactions.")

    df = normalize_columns(df)

    missing_columns = REQUIRED_COLUMNS - set(df.columns)

    if missing_columns:
        raise ValueError(
            "Missing required columns: "
            + ", ".join(sorted(missing_columns))
        )

    return df


def save_transactions(
    df: pd.DataFrame,
    user_id: ObjectId,
):
    database = get_database()
    collection = database["transactions"]

    transactions = []
    skipped_count = 0

    for _, row in df.iterrows():
        try:
            date_value = pd.to_datetime(row["date"], errors="raise")

            if pd.isna(date_value):
                raise ValueError("Invalid date")

            date_value = date_value.to_pydatetime()

            if date_value.tzinfo is None:
                date_value = date_value.replace(tzinfo=timezone.utc)

            symbol = str(row["symbol"]).strip().upper()

            asset_type = str(
                row["asset_type"]
            ).strip().upper()

            transaction_type = str(
                row["transaction_type"]
            ).strip().upper()

            currency = str(
                row["currency"]
            ).strip().upper()

            broker = str(
                row["broker"]
            ).strip()

            quantity = float(row["quantity"])
            price = float(row["price"])

            if not symbol or quantity <= 0 or price < 0:
                raise ValueError("Invalid transaction values")

            if transaction_type not in {"BUY", "SELL"}:
                raise ValueError(
                    "Transaction type must be BUY or SELL"
                )

            total_value = quantity * price

            transactions.append(
                {
                    "user_id": user_id,
                    "date": date_value,
                    "symbol": symbol,
                    "asset_type": asset_type,
                    "transaction_type": transaction_type,
                    "quantity": quantity,
                    "price": price,
                    "currency": currency,
                    "broker": broker,
                    "total_value": total_value,
                    "created_at": datetime.now(timezone.utc),
                }
            )

        except Exception:
            skipped_count += 1

    if transactions:
        result = collection.insert_many(transactions)
        inserted_count = len(result.inserted_ids)
    else:
        inserted_count = 0

    return inserted_count, skipped_count


def get_user_transactions(user_id: ObjectId):
    database = get_database()

    collection = database["transactions"]

    transactions = collection.find(
        {"user_id": user_id}
    ).sort("date", 1)

    result = []

    for transaction in transactions:
        result.append(
            {
                "id": str(transaction["_id"]),
                "date": transaction["date"],
                "symbol": transaction["symbol"],
                "asset_type": transaction["asset_type"],
                "transaction_type": transaction["transaction_type"],
                "quantity": transaction["quantity"],
                "price": transaction["price"],
                "currency": transaction["currency"],
                "broker": transaction["broker"],
                "total_value": transaction["total_value"],
            }
        )

    return result


def delete_user_transactions(user_id: ObjectId):
    database = get_database()

    result = database["transactions"].delete_many(
        {"user_id": user_id}
    )

    return result.deleted_count