from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.user import (
    UserLogin,
    UserRegister,
    UserResponse,
    TokenResponse,
)
from app.services.auth_service import register_user, login_user
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user: UserRegister):
    created_user = register_user(
        name=user.name,
        email=user.email,
        password=user.password,
    )

    if created_user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    return created_user


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(user: UserLogin):
    logged_in_user = login_user(
        email=user.email,
        password=user.password,
    )

    if logged_in_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    return logged_in_user

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
    }