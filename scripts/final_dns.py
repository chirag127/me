import os
import requests
from dotenv import load_dotenv

load_dotenv("c:/AM/GitHub/me/.env")

API_KEY = os.getenv("SPACESHIP_API_KEY")
API_SECRET = os.getenv("SPACESHIP_API_SECRET")
API_BASE_URL = "https://spaceship.dev/api/v1"

TARGET_PAGES_DOMAIN = "chirag127.pages.dev."

def final_update():
    domain = "chirag127.in"
    
    # 1. Fetch current (should be 4 records now)
    res = requests.get(f"{API_BASE_URL}/dns/records/{domain}?take=100&skip=0", headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Accept": "application/json"
    })
    if not res.ok: return
    items = res.json()["items"]
    
    new_items = []
    for item in items:
        item.pop("group", None)
        new_items.append(item)
    
    # Add new records
    # Let's try ALIAS for apex as requested before
    new_items.append({
        "type": "ALIAS",
        "name": "@",
        "aliasName": TARGET_PAGES_DOMAIN,
        "ttl": 1800
    })
    new_items.append({
        "type": "CNAME",
        "name": "www",
        "cname": TARGET_PAGES_DOMAIN,
        "ttl": 1800
    })
    
    print(f"Final update with {len(new_items)} records...")
    put_res = requests.put(f"{API_BASE_URL}/dns/records/{domain}", headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }, json={"items": new_items})
    print(f"Put status: {put_res.status_code}")
    if not put_res.ok:
        print(put_res.text)
    else:
        print("Final update success!")

if __name__ == "__main__":
    final_update()
