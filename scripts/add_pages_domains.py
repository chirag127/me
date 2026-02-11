"""Add custom domains to Cloudflare Pages project"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

account_id = os.getenv('CLOUDFLARE_ACCOUNT_ID')
email = os.getenv('CLOUDFLARE_EMAIL')
api_key = os.getenv('CLOUDFLARE_GLOBAL_API_KEY')

headers = {
    'X-Auth-Email': email,
    'X-Auth-Key': api_key,
    'Content-Type': 'application/json'
}

project_name = 'me'
base_url = f'https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects/{project_name}/domains'

# Domains to add
domains = ['chirag127.in', 'www.chirag127.in', 'me.chirag127.in']

import concurrent.futures

def add_domain(domain):
    """Add a single domain"""
    print(f'Adding {domain}...')
    try:
        result = requests.post(base_url, headers=headers, json={'name': domain}).json()
        if result.get('success'):
            print(f'  ✅ {domain} added successfully!')
            return True
        else:
            errors = result.get('errors', [])
            if any('already exists' in str(e).lower() for e in errors):
                print(f'  ⚠️  {domain} already exists')
            else:
                print(f'  ❌ Error adding {domain}: {errors}')
            return False
    except Exception as e:
        print(f'  ❌ Exception adding {domain}: {e}')
        return False

# Domains to add
domains = ['chirag127.in', 'www.chirag127.in', 'me.chirag127.in']

print(f"🔄 Adding {len(domains)} domains concurrently...")

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    executor.map(add_domain, domains)

# List current domains
print('\n📋 Current custom domains:')
list_result = requests.get(base_url, headers=headers).json()
for d in list_result.get('result', []):
    status = '✅' if d.get('status') == 'active' else '⏳'
    print(f"  {status} {d.get('name')} ({d.get('status', 'pending')})")
