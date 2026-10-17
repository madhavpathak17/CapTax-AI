import hashlib
import os
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

import jwt
from passlib.context import CryptContext
from pymongo.errors import DuplicateKeyError

from app.database.connection import get_database
from app.models.user import create_user_document

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
PASSWORD_RESET_MINUTES = int(os.getenv("PASSWORD_RESET_EXPIRE_MINUTES", "30"))


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(user_id: str):
    secret_key = os.getenv("JWT_SECRET_KEY")
    if not secret_key:
        raise RuntimeError("JWT_SECRET_KEY is not configured.")
    algorithm = os.getenv("JWT_ALGORITHM", "HS256")
    expire_minutes = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    expire = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
    return jwt.encode({"sub": user_id, "exp": expire}, secret_key, algorithm=algorithm)


def _ensure_user_indexes(collection):
    # Sparse unique indexes keep existing user documents without these fields valid.
    collection.create_index("email", unique=True)
    collection.create_index("username", unique=True, sparse=True)


def _public_user(user: dict, user_id: str | None = None):
    return {
        "id": user_id or str(user.get("_id", user.get("id", ""))),
        "name": user.get("name") or "",
        "username": user.get("username"),
        "mobile": user.get("mobile"),
        "email": user.get("email", ""),
    }


def register_user(name: str, username: str, mobile: str, email: str, password: str):
    database = get_database()
    if database is None:
        raise RuntimeError("Database is not connected.")
    users = database["users"]
    _ensure_user_indexes(users)

    email = email.lower().strip()
    username = username.lower().strip()
    if users.find_one({"email": email}):
        return None
    if users.find_one({"username": username}):
        return {"duplicate_username": True}

    user_document = create_user_document(
        name=name,
        username=username,
        mobile=mobile,
        email=email,
        password_hash=hash_password(password),
    )
    try:
        result = users.insert_one(user_document)
    except DuplicateKeyError:
        return None

    return _public_user(user_document, str(result.inserted_id))


def login_user(email: str, password: str):
    database = get_database()
    if database is None:
        raise RuntimeError("Database is not connected.")
    users = database["users"]
    email = email.lower().strip()
    user = users.find_one({"email": email})
    if not user or not verify_password(password, user.get("password_hash", "")):
        return None

    user_id = str(user["_id"])
    return {
        "access_token": create_access_token(user_id),
        "token_type": "bearer",
        "user": _public_user(user, user_id),
    }


def request_password_reset(email: str):
    """Create a short-lived, single-use reset token and email it if SMTP is configured."""
    database = get_database()
    if database is None:
        raise RuntimeError("Database is not connected.")

    email = email.lower().strip()
    user = database["users"].find_one({"email": email})
    # Caller returns the same public response whether or not the email exists.
    if not user:
        return

    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    expires = datetime.now(timezone.utc) + timedelta(minutes=PASSWORD_RESET_MINUTES)
    database["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"password_reset_token_hash": token_hash,
                  "password_reset_expires_at": expires}}
    )

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("SMTP_FROM_EMAIL") or smtp_user
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")

    if not all([smtp_host, smtp_user, smtp_password, from_email]):
        # Do not expose the token in API responses or logs.
        print("Password reset requested, but SMTP is not configured; no reset email was sent.")
        return

    reset_url = f"{frontend_url}/reset-password?token={raw_token}"
    message = EmailMessage()
    message["Subject"] = "Reset your CapTax AI password"
    message["From"] = from_email
    message["To"] = email
    message.set_content(
        "We received a request to reset your CapTax AI password.\n\n"
        f"Use this link within {PASSWORD_RESET_MINUTES} minutes:\n{reset_url}\n\n"
        "If you did not request this, you can ignore this email."
    )

    with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(message)


def reset_password(token: str, new_password: str) -> bool:
    database = get_database()
    if database is None:
        raise RuntimeError("Database is not connected.")

    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    now = datetime.now(timezone.utc)
    user = database["users"].find_one({
        "password_reset_token_hash": token_hash,
        "password_reset_expires_at": {"$gt": now},
    })
    if not user:
        return False

    database["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {
            "password_hash": hash_password(new_password),
            "updated_at": now,
        },
         "$unset": {
            "password_reset_token_hash": "",
            "password_reset_expires_at": "",
         }}
    )
    return True
