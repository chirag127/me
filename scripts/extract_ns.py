"""Get nameservers from Spaceship"""
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
        print("Structure keys:", list(data.keys()))
        if 'nameServers' in data:
            print("NameServers:", data['nameServers'])
        elif 'ns' in data:
            print("NS:", data['ns'])
        else:
            # Look for any list of domains
            for k, v in data.items():
                if isinstance(v, list) and v and isinstance(v[0], str) and '.' in v[0]:
                    print(f"Possible NS found in '{k}':", v)
    else:
        print(f"Error {response.status_code}: {response.text}")
except Exception as e:
    print(f"Error: {e}")
