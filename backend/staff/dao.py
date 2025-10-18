from dao.base import  BaseDAO # Импортируем базовый DAO класс
from staff.models import Staff # Импортируем модель  из модуля 
class StaffDAO(BaseDAO): # Создаем класс , наследующий от BaseDAO

  model =  Staff # Указываем, что этот DAO работает с моделью 
  