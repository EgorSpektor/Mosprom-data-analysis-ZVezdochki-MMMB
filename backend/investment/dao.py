from dao.base import  BaseDAO # Импортируем базовый DAO класс
from investment.models import Investment # Импортируем модель  из модуля 
class InvestmentDAO(BaseDAO): # Создаем класс , наследующий от BaseDAO

  model =  Investment # Указываем, что этот DAO работает с моделью 
  