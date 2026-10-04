from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)

from app.dependencies.auth import get_current_user
from app.schemas.transaction import (
    TransactionResponse,
    TransactionUploadResponse,
)
from app.services.transaction_service import (
    delete_user_transactions,
    get_user_transactions,
    parse_transaction_file,
    save_transactions,
)


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)


@router.post(
    "/upload",
    response_model=TransactionUploadResponse,
)
async def upload_transactions(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file selected.",
        )

    filename = file.filename.lower()

    if not filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV and Excel files are supported.",
        )

    try:
        file_bytes = await file.read()

        dataframe = parse_transaction_file(
            file_bytes,
            file.filename,
        )

        inserted_count, skipped_count = save_transactions(
            dataframe,
            current_user["_id"],
        )

        return {
            "message": "Transactions uploaded successfully.",
            "inserted_count": inserted_count,
            "skipped_count": skipped_count,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process transactions: {error}",
        )


@router.get(
    "/",
    response_model=list[TransactionResponse],
)
def get_transactions(
    current_user: dict = Depends(get_current_user),
):
    return get_user_transactions(
        current_user["_id"]
    )


@router.delete(
    "/",
)
def delete_transactions(
    current_user: dict = Depends(get_current_user),
):
    deleted_count = delete_user_transactions(
        current_user["_id"]
    )

    return {
        "message": "Transactions deleted successfully.",
        "deleted_count": deleted_count,
    }