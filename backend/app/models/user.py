from datetime import datetime, timezone


def create_user_document(
    name: str,
    username: str,
    mobile: str,
    email: str,
    password_hash: str,
):
    now = datetime.now(timezone.utc)
    return {
        "name": name.strip(),
        "username": username.strip().lower(),
        "mobile": mobile.strip(),
        "email": email.lower().strip(),
        "password_hash": password_hash,
        "created_at": now,
        "updated_at": now,
    }
