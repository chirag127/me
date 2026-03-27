import os
import requests
from dotenv import load_dotenv

load_dotenv("c:/AM/GitHub/me/.env")

API_KEY = os.getenv("SPACESHIP_API_KEY")
API_SECRET = os.getenv("SPACESHIP_API_SECRET")
API_BASE_URL = "https://spaceship.dev/api/v1"

TARGET_PAGES_DOMAIN = "chirag127.pages.dev."

def incremental_update():
    domain = "chirag127.in"
    
    # 1. Fetch current
    res = requests.get(f"{API_BASE_URL}/dns/records/{domain}?take=100&skip=0", headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Accept": "application/json"
    })
    if not res.ok: return
    items = res.json()["items"]
    
    # 2. Identify records to delete (the ones pointing to project-omnibus)
    targets = ["@", "www", "now", "portfolio"]
    to_keep = []
    to_delete = []
    
    for item in items:
        if item["name"] in targets and item["type"] in ["A", "AAAA", "CNAME", "ALIAS"]:
            item.pop("group", None)
            to_delete.append(item)
        else:
            item.pop("group", None)
            to_keep.append(item)
    
    print(f"Deleting {len(to_delete)} records...")
    # 3. Delete (if API supports it)
    # The client.py showed a DELETE method for records.
    del_res = requests.delete(f"{API_BASE_URL}/dns/records/{domain}", headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }, json=to_delete)
    print(f"Delete status: {del_res.status_code}")
    
    # 4. Add new ones
    to_keep.append({"type": "CNAME", "name": "@", "cname": TARGET_PAGES_DOMAIN, "ttl": 1800})
    to_keep.append({"type": "CNAME", "name": "www", "cname": TARGET_PAGES_DOMAIN, "ttl": 1800})
    
    print(f"Updating with {len(to_keep)} records...")
    put_res = requests.put(f"{API_BASE_URL}/dns/records/{domain}", headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }, json={"items": to_keep})
    print(f"Put status: {put_res.status_code}")
    if not put_res.ok:
        print(put_res.text)

if __name__ == "__main__":
    incremental_update()
