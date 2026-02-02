"""Print current nameservers"""
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

try:
    response = requests.get(f"{api_url}/domains/chirag127.in", headers=headers)
    if response.status_code == 200:
        data = response.json()
        print("Current Nameservers:", data.get('nameservers'))
    else:
        print(f"Error {response.status_code}: {response.text}")
except Exception as e:
    print(f"Error: {e}")
