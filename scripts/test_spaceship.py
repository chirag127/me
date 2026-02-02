"""Test Spaceship API and list domains"""
import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('SPACESHIP_API_KEY')
api_secret = os.getenv('SPACESHIP_API_SECRET')
# Use the URL from .env or default to spaceship.com if suspicious
api_url = os.getenv('SPACESHIP_API_URL', 'https://api.spaceship.com/v1')

# Spaceship usually uses Basic Auth with Key:Secret
auth_str = f"{api_key}:{api_secret}"
encoded_auth = base64.b64encode(auth_str.encode()).decode()

headers = {
    'Authorization': f'Basic {encoded_auth}',
    'Content-Type': 'application/json'
}

print(f"Connecting to: {api_url}")

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
