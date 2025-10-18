

# ORM-based implementation
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from database import SessionLocal
from company.models import Company
from adress.models import Adress
from staff.models import Staff
from revenue.models import Revenue
from profit.models import Profit
from investment.models import Investment
from tax.models import Tax


def model_to_dict(obj):
    # simple converter for declarative models
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


async def get_company_full_by_inn_orm(inn: int):
    """ORM variant: one async session, load company and related rows with separate queries.

    Returns a dict similar to the SQL variant, or None if company not found.
    """
    async with SessionLocal() as session:
        q = (
            select(Company)
            .options(
                selectinload(Company.addresses),
                selectinload(Company.staff),
                selectinload(Company.revenues),
                selectinload(Company.profits),
                selectinload(Company.investments),
                selectinload(Company.taxes),
            )
            .where(Company.inn == inn)
            .limit(1)
        )

        result = await session.execute(q)
        company = result.scalars().first()
        if company is None:
            return None

        output = model_to_dict(company)

        # Attach related lists using relationship attributes
        output["addresses"] = [model_to_dict(a) for a in company.addresses]
        output["staff"] = [model_to_dict(s) for s in company.staff]
        output["revenues"] = [model_to_dict(r) for r in company.revenues]
        output["profits"] = [model_to_dict(p) for p in company.profits]
        output["investments"] = [model_to_dict(i) for i in company.investments]
        output["taxes"] = [model_to_dict(t) for t in company.taxes]

        return output
