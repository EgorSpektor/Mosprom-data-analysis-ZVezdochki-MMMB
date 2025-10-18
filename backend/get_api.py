import requests
import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())



def get_resp_nfc(inn: int) -> requests.Response:
    url = f"https://api-fns.ru/api/egr?req={inn}&key={os.getenv('SECRET_KEY')}"
    return requests.get(url)


def get_resp_ros(inn: int) -> requests.Response:
    url = f"https://api.damia.ru/rs/balance?inn={inn}&key={os.getenv('SECRET_KEY2')}"
    return requests.get(url)

print(get_resp_ros(6663003127).json())