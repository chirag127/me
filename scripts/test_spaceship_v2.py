"""Retry Spaceship API with X-API headers"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('SPACESHIP_API_KEY')
api_secret = os.getenv('SPACESHIP_API_SECRET')
api_url = "https://api.spaceship.com/v1"

headers = {
    'X-API-Key': api_key,
    'X-API-Secret': api_secret,
    'Content-Type': 'application/json'
}

print(f"Connecting to: {api_url}")
print(f"Using Key: {api_key[:5]}...")

try:
    # Try to list domains
    response = requests.get(f"{api_url}/domains", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Domains:")
        print(response.json())
    else:
        print(f"Error Response: {response.text}")
except Exception as e:
    print(f"Connection failed: {e}")
