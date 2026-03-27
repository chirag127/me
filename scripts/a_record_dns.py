import os
import requests
from dotenv import load_dotenv

load_dotenv("c:/AM/GitHub/me/.env")

API_KEY = os.getenv("SPACESHIP_API_KEY")
API_SECRET = os.getenv("SPACESHIP_API_SECRET")
API_BASE_URL = "https://spaceship.dev/api/v1"

# Cloudflare Edge IPs (captured from nslookup earlier)
CF_IPS = ["172.67.153.162", "104.21.88.231"]
TARGET_PAGES_DOMAIN = "chirag127.pages.dev."

def a_record_update():
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
    # Apex @ as A records
    for ip in CF_IPS:
        new_items.append({
            "type": "A",
            "name": "@",
            "address": ip,
            "ttl": 1800
        })
    # www as CNAME
    new_items.append({
        "type": "CNAME",
        "name": "www",
        "cname": TARGET_PAGES_DOMAIN,
        "ttl": 1800
    })
    
    print(f"Final update with {len(new_items)} records (A for apex)...")
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
        print("A record update success!")

if __name__ == "__main__":
    a_record_update()
