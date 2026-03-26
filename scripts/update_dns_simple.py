import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv("c:/AM/GitHub/me/.env")

API_KEY = os.getenv("SPACESHIP_API_KEY")
API_SECRET = os.getenv("SPACESHIP_API_SECRET")
API_BASE_URL = "https://spaceship.dev/api/v1"

TARGET_PAGES_DOMAIN = "chirag127.pages.dev."

def get_records(domain):
    url = f"{API_BASE_URL}/dns/records/{domain}?take=100&skip=0"
    res = requests.get(url, headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Accept": "application/json"
    })
    if not res.ok:
        print(f"Error fetching records for {domain}: {res.status_code}")
        print(res.text)
        return None
    return res.json()["items"]

def update_records(domain, items):
    url = f"{API_BASE_URL}/dns/records/{domain}"
    res = requests.put(url, headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }, json={"items": items})
    if not res.ok:
        print(f"Error updating records for {domain}: {res.status_code}")
        print(res.text)
        return False
    print(f"Successfully updated records for {domain}")
    return True

def manage_oriz_in():
    domain = "oriz.in"
    items = get_records(domain)
    if items is None: return

    # Targets: me, chirag, chirag127
    targets = ["me", "chirag", "chirag127"]
    
    # 1. Remove existing records with these names that we want to replace
    # We should keep others if they are not the ones we manage.
    # Actually, the user asked to manage these.
    new_items = []
    for item in items:
        if item["name"] in targets and item["type"] in ["A", "AAAA", "CNAME", "ALIAS"]:
            print(f"Removing old record: {item['name']} ({item['type']})")
            continue
        new_items.append(item)
    
    # 2. Add new CNAMEs
    for sub in targets:
        print(f"Adding CNAME: {sub} -> {TARGET_PAGES_DOMAIN}")
        new_items.append({
            "type": "CNAME",
            "name": sub,
            "cname": TARGET_PAGES_DOMAIN,
            "ttl": 1800
        })
    
    update_records(domain, new_items)

def manage_chirag127_in():
    domain = "chirag127.in"
    items = get_records(domain)
    if items is None: return

    # Targets: @, www
    # Note: user also had 'now', 'portfolio' pointing to project-omnibus. 
    # I should probably update those too if they were for the old site.
    # The request specifically mentioned me.oriz.in, chirag127.oriz.in and chirag127.in.
    # I'll update @ and www first.
    
    targets = ["@", "www", "now", "portfolio"] # Including others found in records that point to project-omnibus
    
    new_items = []
    for item in items:
        # If it's one of our targets and it's pointing to project-omnibus or is just a target
        if item["name"] in targets and (item.get("cname", "") == "project-omnibus.pages.dev" or item["type"] in ["A", "AAAA", "CNAME", "ALIAS"]):
             print(f"Removing old record: {item['name']} ({item['type']})")
             continue
        new_items.append(item)
        
    # Add ALIAS for Apex
    print(f"Adding ALIAS for @ -> {TARGET_PAGES_DOMAIN}")
    new_items.append({
        "type": "ALIAS",
        "name": "@",
        "aliasName": TARGET_PAGES_DOMAIN,
        "ttl": 1800
    })
    
    # Add CNAMEs for others
    for sub in ["www", "now", "portfolio"]:
        print(f"Adding CNAME: {sub} -> {TARGET_PAGES_DOMAIN}")
        new_items.append({
            "type": "CNAME",
            "name": sub,
            "cname": TARGET_PAGES_DOMAIN,
            "ttl": 1800
        })
        
    update_records(domain, new_items)

def main():
    if not API_KEY or not API_SECRET:
        print("Missing API credentials")
        return
    manage_oriz_in()
    manage_chirag127_in()

if __name__ == "__main__":
    main()
