import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "captax_ai")

client = None
database = None


def connect_to_database():
    global client, database

    if not MONGODB_URL:
        raise ValueError("MONGODB_URL is not set in .env")

    client = MongoClient(
        MONGODB_URL,
        serverSelectionTimeoutMS=5000
    )

    # Test the connection
    client.admin.command("ping")

    database = client[DATABASE_NAME]

    print("MongoDB connected successfully!")


def get_database():
    return database


def check_database_connection():
    try:
        if client is None:
            return False

        client.admin.command("ping")
        return True

    except PyMongoError:
        return False