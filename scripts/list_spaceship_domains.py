"""List Spaceship domains with pagination"""
import os
import requests
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

params = {
    'skip': 0,
    'take': 10
}

print(f"Connecting to: {api_url}")

try:
    response = requests.get(f"{api_url}/domains", headers=headers, params=params)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Total domains: {data.get('total', 0)}")
        for domain in data.get('items', []):
            print(f"Domain: {domain.get('name')} (Status: {domain.get('status')})")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
