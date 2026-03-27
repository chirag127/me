import os
import requests
from dotenv import load_dotenv
load_dotenv("c:/AM/GitHub/me/.env")

api_key = os.getenv("SPACESHIP_API_KEY")
api_secret = os.getenv("SPACESHIP_API_SECRET")

def list_records(domain):
    url = f"https://spaceship.dev/api/v1/dns/records/{domain}?take=100&skip=0"
    res = requests.get(url, headers={
        "X-API-Key": api_key,
        "X-API-Secret": api_secret,
        "Accept": "application/json"
    })
    print(f"--- {domain} ({res.status_code}) ---")
    if res.ok:
        items = res.json().get("items", [])
        for item in items:
            name = item.get("name")
            record_type = item.get("type")
            value = item.get("value") or item.get("cname") or item.get("aliasName") or item.get("address")
            print(f"{name} [{record_type}] -> {value}")

list_records("oriz.in")
list_records("chirag127.in")
