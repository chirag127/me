"""Check DNS records concurrently"""
import os
import requests
import concurrent.futures
from dotenv import load_dotenv

load_dotenv()

headers = {
    'X-Auth-Email': os.getenv('CLOUDFLARE_EMAIL'),
    'X-Auth-Key': os.getenv('CLOUDFLARE_GLOBAL_API_KEY'),
    'Content-Type': 'application/json'
}

def check_domain(domain):
    """Check DNS records for a single domain"""
    try:
        zones = requests.get('https://api.cloudflare.com/client/v4/zones', headers=headers).json()
        zone_id = next((z['id'] for z in zones.get('result', []) if z['name'] == domain or domain.endswith('.' + z['name'])), None)

        if not zone_id:
            return f"❌ Zone not found for {domain}"

        records = requests.get(f'https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records', headers=headers).json()

        output = [f'DNS Records for {domain}:', '-' * 80]
        for r in records.get('result', []):
            proxied = '🟠' if r.get('proxied') else '⚪'
            output.append(f"  {proxied} {r['type']:6} {r['name']:30} -> {r['content'][:40]}")

        return "\n".join(output)
    except Exception as e:
        return f"❌ Error checking {domain}: {str(e)}"

# Domains to check
domains_to_check = ['chirag127.in']

print(f"🔄 Checking DNS for {len(domains_to_check)} domains concurrently...")

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    results = executor.map(check_domain, domains_to_check)
    for result in results:
        print(result)
        print("-" * 80)
