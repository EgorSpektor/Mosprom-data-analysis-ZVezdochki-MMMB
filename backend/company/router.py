import json
import requests

resp = requests.get("https://api-fns.ru/api/egr?req=7721840520&key=4c5bf10ba2f88168c072459dc9a8490729e14d5d")
print(resp.json())