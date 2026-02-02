"""Identify required nameservers from Cloudflare"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

headers = {
    'X-Auth-Email': os.getenv('CLOUDFLARE_EMAIL'),
    'X-Auth-Key': os.getenv('CLOUDFLARE_GLOBAL_API_KEY'),
    'Content-Type': 'application/json'
}

# Get zone info
zones = requests.get('https://api.cloudflare.com/client/v4/zones', headers=headers).json()
zone = next((z for z in zones.get('result', []) if z['name'] == 'chirag127.in'), None)

if zone:
    print(f"Zone Status: {zone['status']}")
    print("Required Nameservers:")
    for ns in zone.get('name_servers', []):
        print(f"  - {ns}")
else:
    print("Zone chirag127.in not found in Cloudflare account.")
