from dao.base import  BaseDAO # Импортируем базовый DAO класс
from adress.models import Adress # Импортируем модель Address из модуля adress.models
class AdressDAO(BaseDAO): # Создаем класс AddressDAO, наследующий от BaseDAO

  model = Adress # Указываем, что этот DAO работает с моделью Address
  