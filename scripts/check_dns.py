"""Check DNS records"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

headers = {
    'X-Auth-Email': os.getenv('CLOUDFLARE_EMAIL'),
    'X-Auth-Key': os.getenv('CLOUDFLARE_GLOBAL_API_KEY'),
    'Content-Type': 'application/json'
}

zones = requests.get('https://api.cloudflare.com/client/v4/zones', headers=headers).json()
zone_id = next((z['id'] for z in zones.get('result', []) if z['name'] == 'chirag127.in'), None)

records = requests.get(f'https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records', headers=headers).json()

print('DNS Records for chirag127.in:')
print('-' * 80)
for r in records.get('result', []):
    proxied = '🟠' if r.get('proxied') else '⚪'
    print(f"  {proxied} {r['type']:6} {r['name']:30} -> {r['content'][:40]}")
