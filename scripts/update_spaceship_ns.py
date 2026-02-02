"""Update nameservers in Spaceship to Cloudflare"""
import os
import requests
import json
import time
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('SPACESHIP_API_KEY')
api_secret = os.getenv('SPACESHIP_API_SECRET')
api_url = "https://spaceship.dev/api/v1"

headers = {
    'X-API-Key': api_key,
    'X-API-Secret': api_secret,
    'Content-Type': 'application/json'
}

domain = "chirag127.in"
# Cloudflare nameservers
target_ns = ["howard.ns.cloudflare.com", "sierra.ns.cloudflare.com"]

print(f"Updating nameservers for {domain} to:")
for ns in target_ns:
    print(f"  - {ns}")

endpoint = f"{api_url}/domains/{domain}/nameservers"

try:
    # Structure based on Terraform provider docs
    payload = {
        "provider": "custom",
        "hosts": target_ns
    }

    # Try PUT first
    response = requests.put(endpoint, headers=headers, json=payload)
    print(f"Status Code (PUT): {response.status_code}")

    if response.status_code == 405: # Method not allowed, try POST
        print("PUT not allowed, trying POST...")
        response = requests.post(endpoint, headers=headers, json=payload)
        print(f"Status Code (POST): {response.status_code}")

    if response.status_code in [200, 201, 204]:
        print("✅ Nameservers updated successfully!")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"❌ Request failed: {e}")
