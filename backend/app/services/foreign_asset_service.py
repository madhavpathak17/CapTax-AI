from datetime import datetime, timezone

from bson import ObjectId

from app.database.connection import get_database
from app.schemas.foreign_asset import ForeignAssetCreate


def create_foreign_asset(
    user_id: ObjectId,
    asset: ForeignAssetCreate,
):
    database = get_database()

    collection = database["foreign_assets"]

    document = {
        "user_id": user_id,

        "asset_name": asset.asset_name.strip(),

        "asset_type": asset.asset_type.strip().upper(),

        "country": asset.country.strip(),

        "institution": asset.institution.strip(),

        "currency": asset.currency.strip().upper(),

        "acquisition_date": asset.acquisition_date,

        "peak_value": float(asset.peak_value),

        "current_value": float(asset.current_value),

        "dividend_income": float(
            asset.dividend_income
        ),

        "foreign_tax_paid": float(
            asset.foreign_tax_paid
        ),

        "created_at": datetime.now(
            timezone.utc
        ),
    }

    result = collection.insert_one(
        document
    )

    document["id"] = str(
        result.inserted_id
    )

    return format_foreign_asset(
        document
    )


def get_user_foreign_assets(
    user_id: ObjectId,
):
    database = get_database()

    collection = database["foreign_assets"]

    assets = collection.find(
        {
            "user_id": user_id
        }
    ).sort(
        "acquisition_date",
        1,
    )

    return [
        format_foreign_asset(asset)
        for asset in assets
    ]


def update_foreign_asset(
    user_id: ObjectId,
    asset_id: str,
    asset: ForeignAssetCreate,
):
    database = get_database()

    collection = database["foreign_assets"]

    try:
        object_id = ObjectId(asset_id)
    except Exception:
        return None

    existing = collection.find_one(
        {
            "_id": object_id,
            "user_id": user_id,
        }
    )

    if not existing:
        return None

    update_data = {
        "asset_name": asset.asset_name.strip(),

        "asset_type": asset.asset_type.strip().upper(),

        "country": asset.country.strip(),

        "institution": asset.institution.strip(),

        "currency": asset.currency.strip().upper(),

        "acquisition_date": asset.acquisition_date,

        "peak_value": float(asset.peak_value),

        "current_value": float(asset.current_value),

        "dividend_income": float(
            asset.dividend_income
        ),

        "foreign_tax_paid": float(
            asset.foreign_tax_paid
        ),
    }

    collection.update_one(
        {
            "_id": object_id,
            "user_id": user_id,
        },
        {
            "$set": update_data
        },
    )

    updated = collection.find_one(
        {
            "_id": object_id,
            "user_id": user_id,
        }
    )

    return format_foreign_asset(
        updated
    )


def delete_foreign_asset(
    user_id: ObjectId,
    asset_id: str,
):
    database = get_database()

    collection = database["foreign_assets"]

    try:
        object_id = ObjectId(asset_id)
    except Exception:
        return False

    result = collection.delete_one(
        {
            "_id": object_id,
            "user_id": user_id,
        }
    )

    return result.deleted_count > 0


def get_foreign_asset_summary(
    user_id: ObjectId,
):
    assets = get_user_foreign_assets(
        user_id
    )

    total_current_value = sum(
        asset["current_value"]
        for asset in assets
    )

    total_peak_value = sum(
        asset["peak_value"]
        for asset in assets
    )

    total_dividend_income = sum(
        asset["dividend_income"]
        for asset in assets
    )

    total_foreign_tax_paid = sum(
        asset["foreign_tax_paid"]
        for asset in assets
    )

    return {
        "total_assets": len(assets),

        "total_current_value": round(
            total_current_value,
            2,
        ),

        "total_peak_value": round(
            total_peak_value,
            2,
        ),

        "total_dividend_income": round(
            total_dividend_income,
            2,
        ),

        "total_foreign_tax_paid": round(
            total_foreign_tax_paid,
            2,
        ),

        "assets": assets,
    }


def format_foreign_asset(
    asset: dict,
):
    return {
        "id": str(
            asset.get(
                "_id",
                asset.get("id"),
            )
        ),

        "asset_name": asset["asset_name"],

        "asset_type": asset["asset_type"],

        "country": asset["country"],

        "institution": asset["institution"],

        "currency": asset["currency"],

        "acquisition_date": asset[
            "acquisition_date"
        ],

        "peak_value": float(
            asset["peak_value"]
        ),

        "current_value": float(
            asset["current_value"]
        ),

        "dividend_income": float(
            asset["dividend_income"]
        ),

        "foreign_tax_paid": float(
            asset["foreign_tax_paid"]
        ),

        "created_at": asset[
            "created_at"
        ],
    }