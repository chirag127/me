import os
import requests
from dotenv import load_dotenv

load_dotenv("c:/AM/GitHub/me/.env")

API_KEY = os.getenv("SPACESHIP_API_KEY")
API_SECRET = os.getenv("SPACESHIP_API_SECRET")
API_BASE_URL = "https://spaceship.dev/api/v1"

def test_restore():
    domain = "chirag127.in"
    
    # These are the 4 records left after DELETE (Step 323)
    original_items = [
        {
            "exchange": "mx2.efwd.spaceship.net",
            "preference": 0,
            "name": "@",
            "type": "MX",
            "ttl": 1200
        },
        {
            "exchange": "mx1.efwd.spaceship.net",
            "preference": 0,
            "name": "@",
            "type": "MX",
            "ttl": 1200
        },
        {
            "value": "v=spf1 include:spf.efwd.spaceship.net ~all",
            "name": "@",
            "type": "TXT",
            "ttl": 1200
        },
        {
            "value": "bitmedia-site-verification=b15e3c61825f18eb2f91ce30253a532e",
            "name": "@",
            "type": "TXT",
            "ttl": 3600
        }
    ]
    
    print(f"Attempting to PUT {len(original_items)} original records for {domain}...")
    res = requests.put(f"{API_BASE_URL}/dns/records/{domain}", headers={
        "X-API-Key": API_KEY,
        "X-API-Secret": API_SECRET,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }, json={"items": original_items})
    
    print(f"Put status: {res.status_code}")
    if res.ok:
        print("Restore success!")
    else:
        print(res.text)

if __name__ == "__main__":
    test_restore()
