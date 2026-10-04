from datetime import date, datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP
from functools import lru_cache
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json


FRANKFURTER_API = "https://api.frankfurter.dev/v2"


SUPPORTED_CURRENCIES = {
    "INR",
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "SGD",
}


def _request_json(url: str):
    request = Request(
        url,
        headers={
            "User-Agent": "CapTax-AI/1.0"
        },
    )

    with urlopen(request, timeout=10) as response:
        return json.loads(
            response.read().decode("utf-8")
        )


def _parse_decimal(value):
    return Decimal(str(value))


def _normalize_date(value):
    """
    Convert date/datetime/string values into
    YYYY-MM-DD format.

    MongoDB transactions may contain datetime values
    such as:
        2026-01-10T00:00:00

    The FX API requires:
        2026-01-10
    """

    if isinstance(value, datetime):
        return value.date().isoformat()

    if isinstance(value, date):
        return value.isoformat()

    value = str(value).strip()

    if "T" in value:
        value = value.split("T")[0]

    if " " in value:
        value = value.split(" ")[0]

    # Validate that the final value is a real date.
    date.fromisoformat(value)

    return value


@lru_cache(maxsize=512)
def get_historical_rate(
    base_currency: str,
    quote_currency: str,
    target_date: str,
):
    base_currency = (
        base_currency.upper().strip()
    )

    quote_currency = (
        quote_currency.upper().strip()
    )

    target_date = _normalize_date(target_date)

    if base_currency == quote_currency:
        return {
            "date": target_date,
            "base": base_currency,
            "quote": quote_currency,
            "rate": Decimal("1"),
            "source": "same_currency",
        }

    requested_date = date.fromisoformat(
        target_date
    )

    # Prefer FBIL provider data for INR pairs.
    rate = _get_fbil_rate(
        base_currency,
        quote_currency,
        requested_date,
    )

    if rate:
        return rate

    # Fallback to Frankfurter.
    rate = _get_frankfurter_rate(
        base_currency,
        quote_currency,
        requested_date,
    )

    if rate:
        return rate

    raise ValueError(
        f"No exchange rate available for "
        f"{base_currency}/{quote_currency} "
        f"around {target_date}."
    )


def _get_fbil_rate(
    base_currency: str,
    quote_currency: str,
    requested_date: date,
):
    """
    Retrieve INR-related rates from the FBIL
    provider through Frankfurter.
    """

    if (
        base_currency != "INR"
        and quote_currency != "INR"
    ):
        return None

    for offset in range(0, 8):
        lookup_date = (
            requested_date
            - timedelta(days=offset)
        )

        params = urlencode(
            {
                "date": lookup_date.isoformat(),
                "base": "INR",
                "quotes": (
                    base_currency
                    if quote_currency == "INR"
                    else quote_currency
                ),
                "providers": "fbil",
            }
        )

        url = (
            f"{FRANKFURTER_API}"
            f"/providers/fbil/rates?"
            f"{params}"
        )

        try:
            data = _request_json(url)

        except (
            HTTPError,
            URLError,
            TimeoutError,
            ValueError,
        ):
            continue

        if not data:
            continue

        for row in data:
            row_base = (
                row.get("base", "")
                .upper()
            )

            row_quote = (
                row.get("quote", "")
                .upper()
            )

            row_rate = row.get("rate")

            if row_rate is None:
                continue

            rate = _parse_decimal(
                row_rate
            )

            # INR -> foreign currency
            if (
                base_currency == "INR"
                and row_quote == quote_currency
            ):
                return {
                    "date": row.get(
                        "date",
                        lookup_date.isoformat(),
                    ),
                    "base": base_currency,
                    "quote": quote_currency,
                    "rate": (
                        Decimal("1") / rate
                    ),
                    "source": "FBIL",
                }

            # Foreign currency -> INR
            if (
                quote_currency == "INR"
                and row_quote == base_currency
            ):
                return {
                    "date": row.get(
                        "date",
                        lookup_date.isoformat(),
                    ),
                    "base": base_currency,
                    "quote": quote_currency,
                    "rate": rate,
                    "source": "FBIL",
                }

    return None


def _get_frankfurter_rate(
    base_currency: str,
    quote_currency: str,
    requested_date: date,
):
    """
    Retrieve historical exchange rates from
    Frankfurter.

    Weekends/holidays are handled by looking
    backward up to seven days.
    """

    for offset in range(0, 8):
        lookup_date = (
            requested_date
            - timedelta(days=offset)
        )

        url = (
            f"{FRANKFURTER_API}"
            f"/rate/"
            f"{base_currency.lower()}/"
            f"{quote_currency.lower()}"
            f"?date={lookup_date.isoformat()}"
        )

        try:
            data = _request_json(url)

        except (
            HTTPError,
            URLError,
            TimeoutError,
            ValueError,
        ):
            continue

        if not data:
            continue

        rate = data.get("rate")

        if rate is None:
            continue

        return {
            "date": data.get(
                "date",
                lookup_date.isoformat(),
            ),
            "base": base_currency,
            "quote": quote_currency,
            "rate": _parse_decimal(rate),
            "source": "Frankfurter",
        }

    return None


def convert_to_inr(
    amount,
    currency: str,
    transaction_date,
):
    """
    Convert an amount from its original currency
    into INR using the historical exchange rate
    applicable to the transaction date.
    """

    currency = (
        currency.upper().strip()
    )

    amount = _parse_decimal(amount)

    # IMPORTANT:
    # Normalize datetime -> YYYY-MM-DD.
    date_string = _normalize_date(
        transaction_date
    )

    result = get_historical_rate(
        base_currency=currency,
        quote_currency="INR",
        target_date=date_string,
    )

    converted_amount = (
        amount * result["rate"]
    ).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )

    return {
        "original_amount": amount,
        "original_currency": currency,
        "inr_amount": converted_amount,
        "rate": result["rate"],
        "rate_date": result["date"],
        "source": result["source"],
    }