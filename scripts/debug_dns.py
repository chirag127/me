import os
import requests
import json
from dotenv import load_dotenv

load_dotenv("c:/AM/GitHub/me/.env")

API_KEY = os.getenv("SPACESHIP_API_KEY")
API_SECRET = os.getenv("SPACESHIP_API_SECRET")
API_BASE_URL = "https://spaceship.dev/api/v1"

TARGET_PAGES_DOMAIN = "chirag127.pages.dev."

def debug_update():
    domain = "chirag127.in"
    print(f"--- Debug Update for {domain} ---")
    
    # 1. Fetch
    url = f"{API_BASE_URL}/dns/records/{domain}?take=100&skip=0"
    res = requests.get(url, headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Accept": "application/json"
    })
    if not res.ok:
        print(f"Fetch failed: {res.status_code}")
        return

    items = res.json()["items"]
    new_items = []
    targets = ["@", "www", "now", "portfolio"]
    
    for item in items:
        # Keep non-target records or non-pointing records for targets
        if item["name"] not in targets or item["type"] not in ["A", "AAAA", "CNAME", "ALIAS"]:
            item.pop("group", None) # Clean payload
            new_items.append(item)
    
    # Add new records
    # Let's try CNAME for apex since it was there before
    new_items.append({
        "type": "CNAME",
        "name": "@",
        "cname": TARGET_PAGES_DOMAIN,
        "ttl": 1800
    })
    new_items.append({
        "type": "CNAME",
        "name": "www",
        "cname": TARGET_PAGES_DOMAIN,
        "ttl": 1800
    })
    
    print("New payload items:")
    for i, it in enumerate(new_items):
        print(f" {i}: {it['name']} [{it['type']}]")

    # 2. Put
    put_url = f"{API_BASE_URL}/dns/records/{domain}"
    res = requests.put(put_url, headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }, json={"items": new_items})
    
    print(f"Update status: {res.status_code}")
    if not res.ok:
        print(res.text)
    else:
        print("Success!")

if __name__ == "__main__":
    debug_update()
