from dao.base import  BaseDAO # Импортируем базовый DAO класс
from company.models import Company # Импортируем модель Address из модуля adress.models
class CompanyDAO(BaseDAO): # Создаем класс, наследующий от BaseDAO

  model = Company # Указываем, что этот DAO работает с моделью Address
  