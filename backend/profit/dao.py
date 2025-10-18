from dao.base import  BaseDAO # Импортируем базовый DAO класс
from profit.models import Profit # Импортируем модель  из модуля 
class ProfitDAO(BaseDAO): # Создаем класс , наследующий от BaseDAO

  model =  Profit # Указываем, что этот DAO работает с моделью 
  