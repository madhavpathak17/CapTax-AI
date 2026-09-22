import os
from datetime import datetime, timedelta, timezone

import jwt
from passlib.context import CryptContext
from pymongo.errors import DuplicateKeyError

from app.database.connection import get_database
from app.models.user import create_user_document

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(user_id: str):
    secret_key = os.getenv("JWT_SECRET_KEY")
    algorithm = os.getenv("JWT_ALGORITHM", "HS256")
    expire_minutes = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expire_minutes
    )

    payload = {
        "sub": user_id,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        secret_key,
        algorithm=algorithm,
    )


def register_user(name: str, email: str, password: str):
    database = get_database()
    users_collection = database["users"]

    email = email.lower().strip()

    existing_user = users_collection.find_one({"email": email})

    if existing_user:
        return None

    password_hash = hash_password(password)

    user_document = create_user_document(
        name=name.strip(),
        email=email,
        password_hash=password_hash,
    )

    try:
        result = users_collection.insert_one(user_document)
    except DuplicateKeyError:
        return None

    return {
        "id": str(result.inserted_id),
        "name": user_document["name"],
        "email": user_document["email"],
    }


def login_user(email: str, password: str):
    database = get_database()
    users_collection = database["users"]

    email = email.lower().strip()

    user = users_collection.find_one({"email": email})

    if not user:
        return None

    if not verify_password(password, user["password_hash"]):
        return None

    user_id = str(user["_id"])

    access_token = create_access_token(user_id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
        },
    }