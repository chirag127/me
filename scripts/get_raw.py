import os
import requests
from dotenv import load_dotenv
load_dotenv("c:/AM/GitHub/me/.env")

api_key = os.getenv("SPACESHIP_API_KEY")
api_secret = os.getenv("SPACESHIP_API_SECRET")

url = "https://spaceship.dev/api/v1/dns/records/oriz.in?take=100&skip=0"
res = requests.get(url, headers={
    "X-API-Key": api_key,
    "X-API-Secret": api_secret,
    "Accept": "application/json"
})
print("oriz.in status:", res.status_code)
print("oriz.in records:", res.text)

url2 = "https://spaceship.dev/api/v1/dns/records/chirag127.in?take=100&skip=0"
res2 = requests.get(url2, headers={
    "X-API-Key": api_key,
    "X-API-Secret": api_secret,
    "Accept": "application/json"
})
print("chirag127.in status:", res2.status_code)
print("chirag127.in records:", res2.text)
