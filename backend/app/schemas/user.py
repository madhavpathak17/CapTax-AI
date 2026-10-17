from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    username: str = Field(..., min_length=3, max_length=30, pattern=r"^[A-Za-z0-9_.-]+$")
    mobile: str = Field(..., min_length=10, max_length=16, pattern=r"^[0-9+() -]+$")
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=32, max_length=256)
    new_password: str = Field(..., min_length=8, max_length=128)


class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    name: str
    username: str | None = None
    mobile: str | None = None
    email: EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
