"""Get domain details from Spaceship"""
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

print(f"Connecting to: {api_url}")

try:
    response = requests.get(f"{api_url}/domains/chirag127.in", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Domain Details:")
        import json
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
