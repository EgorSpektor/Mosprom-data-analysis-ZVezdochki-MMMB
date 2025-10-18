from dao.base import  BaseDAO # Импортируем базовый DAO класс
from revenue.models import Revenue # Импортируем модель  из модуля 
class RevenueDAO(BaseDAO): # Создаем класс , наследующий от BaseDAO

  model =  Revenue # Указываем, что этот DAO работает с моделью 
  