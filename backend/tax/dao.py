from dao.base import  BaseDAO # Импортируем базовый DAO класс
from tax.models import Tax # Импортируем модель  из модуля 
class TaxDAO(BaseDAO): # Создаем класс , наследующий от BaseDAO

  model =  Tax # Указываем, что этот DAO работает с моделью 
  