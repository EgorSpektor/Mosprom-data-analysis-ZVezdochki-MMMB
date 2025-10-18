from fastapi import APIRouter, Depends

from adress.dao import AdressDAO


router = APIRouter(
    prefix="/adress",
    tags=["Адрес"]
)
