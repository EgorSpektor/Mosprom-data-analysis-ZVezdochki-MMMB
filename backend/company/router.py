from fastapi import APIRouter
from company.dao import CompanyDAO


router = APIRouter(
    prefix="/company",
    tags=["Компания"]
)


@router.get("/companies/{inn}/full")
async def company_full(inn: int):
    """Return company and related records as one JSON object."""
    res = await CompanyDAO.get_company(inn)
    if res is None:
        return {"error": "company not found"}
    return res

