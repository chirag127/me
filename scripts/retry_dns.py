import os
import requests
import json
import time
from dotenv import load_dotenv

load_dotenv("c:/AM/GitHub/me/.env")

API_KEY = os.getenv("SPACESHIP_API_KEY")
API_SECRET = os.getenv("SPACESHIP_API_SECRET")
API_BASE_URL = "https://spaceship.dev/api/v1"

TARGET_PAGES_DOMAIN = "chirag127.pages.dev."

def update_chirag127_in():
    domain = "chirag127.in"
    print(f"Fetching records for {domain}...")
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
        # Keep non-target records
        if item["name"] not in targets:
            # Remove group if present to keep payload clean
            item.pop("group", None)
            new_items.append(item)
        elif item["type"] not in ["A", "AAAA", "CNAME", "ALIAS"]:
            item.pop("group", None)
            new_items.append(item)

    # Add the new pointing records
    # Apex @ as ALIAS
    new_items.append({
        "type": "ALIAS",
        "name": "@",
        "aliasName": TARGET_PAGES_DOMAIN,
        "ttl": 1800
    })
    # www as CNAME
    new_items.append({
        "type": "CNAME",
        "name": "www",
        "cname": TARGET_PAGES_DOMAIN,
        "ttl": 1800
    })
    
    print(f"Updating {domain} with {len(new_items)} records...")
    put_url = f"{API_BASE_URL}/dns/records/{domain}"
    res = requests.put(put_url, headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }, json={"items": new_items})
    
    if res.ok:
        print(f"Successfully updated {domain}")
    else:
        print(f"Update failed: {res.status_code}")
        print(res.text)

if __name__ == "__main__":
    update_chirag127_in()
