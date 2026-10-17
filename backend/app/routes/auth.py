from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.user import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserLogin,
    UserRegister,
    UserResponse,
    TokenResponse,
)
from app.services.auth_service import (
    register_user,
    login_user,
    request_password_reset,
    reset_password,
)
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user: UserRegister):
    try:
        created_user = register_user(
            name=user.name,
            username=user.username,
            mobile=user.mobile,
            email=str(user.email),
            password=user.password,
        )
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error))

    if created_user and created_user.get("duplicate_username"):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="That username is already taken. Please choose another.",
        )
    if created_user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )
    return created_user


@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin):
    try:
        logged_in_user = login_user(
            email=str(user.email),
            password=user.password,
        )
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error))

    if logged_in_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    return logged_in_user


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user.get("name") or "",
        "username": current_user.get("username"),
        "mobile": current_user.get("mobile"),
        "email": current_user["email"],
    }


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password(request: ForgotPasswordRequest):
    # Always return the same public response to avoid account enumeration.
    generic_response = {
        "message": "If an account exists for this email and password recovery is configured, reset instructions will be sent."
    }
    try:
        request_password_reset(str(request.email))
    except Exception as error:
        # Do not disclose whether an account exists or SMTP details.
        print(f"Password reset request could not be processed: {type(error).__name__}")
    return generic_response


@router.post("/reset-password")
def change_password(request: ResetPasswordRequest):
    try:
        changed = reset_password(request.token, request.new_password)
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error))
    if not changed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link is invalid or has expired. Request a new one.",
        )
    return {"message": "Your password has been reset. You can now sign in."}
