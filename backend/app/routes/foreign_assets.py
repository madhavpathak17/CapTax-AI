from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from app.dependencies.auth import (
    get_current_user,
)

from app.schemas.foreign_asset import (
    ForeignAssetCreate,
    ForeignAssetResponse,
    ForeignAssetSummary,
)

from app.services.foreign_asset_service import (
    create_foreign_asset,
    delete_foreign_asset,
    get_foreign_asset_summary,
    get_user_foreign_assets,
    update_foreign_asset,
)


router = APIRouter(
    prefix="/foreign-assets",
    tags=["Foreign Assets"],
)


@router.post(
    "/",
    response_model=ForeignAssetResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_asset(
    asset: ForeignAssetCreate,
    current_user: dict = Depends(
        get_current_user
    ),
):
    return create_foreign_asset(
        user_id=current_user["_id"],
        asset=asset,
    )


@router.get(
    "/",
    response_model=list[ForeignAssetResponse],
)
def get_assets(
    current_user: dict = Depends(
        get_current_user
    ),
):
    return get_user_foreign_assets(
        current_user["_id"]
    )


@router.get(
    "/summary",
    response_model=ForeignAssetSummary,
)
def get_assets_summary(
    current_user: dict = Depends(
        get_current_user
    ),
):
    return get_foreign_asset_summary(
        current_user["_id"]
    )


@router.put(
    "/{asset_id}",
    response_model=ForeignAssetResponse,
)
def update_asset(
    asset_id: str,
    asset: ForeignAssetCreate,
    current_user: dict = Depends(
        get_current_user
    ),
):
    updated = update_foreign_asset(
        user_id=current_user["_id"],
        asset_id=asset_id,
        asset=asset,
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Foreign asset not found.",
        )

    return updated


@router.delete(
    "/{asset_id}",
)
def delete_asset(
    asset_id: str,
    current_user: dict = Depends(
        get_current_user
    ),
):
    deleted = delete_foreign_asset(
        user_id=current_user["_id"],
        asset_id=asset_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Foreign asset not found.",
        )

    return {
        "message": "Foreign asset deleted successfully."
    }