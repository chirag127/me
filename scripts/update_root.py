"""Update root domain to point to me site"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

headers = {
    'X-Auth-Email': os.getenv('CLOUDFLARE_EMAIL'),
    'X-Auth-Key': os.getenv('CLOUDFLARE_GLOBAL_API_KEY'),
    'Content-Type': 'application/json'
}

# Get zone ID
zones = requests.get('https://api.cloudflare.com/client/v4/zones', headers=headers).json()
zone_id = next((z['id'] for z in zones.get('result', []) if z['name'] == 'chirag127.in'), None)
print(f'Zone ID: {zone_id[:8]}...')

# Find root record
records = requests.get(f'https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records', headers=headers).json()
root_record = next((r for r in records.get('result', []) if r['name'] == 'chirag127.in' and r['type'] == 'CNAME'), None)

if root_record:
    print(f"Updating root: {root_record['content']} -> me-791.pages.dev")
    result = requests.put(
        f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{root_record['id']}",
        headers=headers,
        json={'type': 'CNAME', 'name': 'chirag127.in', 'content': 'me-791.pages.dev', 'proxied': True, 'ttl': 1}
    ).json()
    if result.get('success'):
        print('✅ Root domain updated!')
    else:
        print(f"❌ {result.get('errors')}")
else:
    print('Root CNAME not found')
