import os
import sys
import json
import urllib.request
import urllib.error

# Update SPF Record for Cloudflare + Gmail
# Usage: python scripts/update_spf_dns.py

def load_env():
    """Simple .env loader to avoid external dependencies"""
    env_vars = {}
    try:
        with open('.env', 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, value = line.split('=', 1)
                    value = value.strip().strip("'").strip('"')
                    env_vars[key.strip()] = value
    except FileNotFoundError:
        pass
    return env_vars

def cf_api_request(method, endpoint, auth_config, data=None):
    url = f"https://api.cloudflare.com/client/v4{endpoint}"
    headers = {
        "Content-Type": "application/json"
    }

    if 'token' in auth_config:
         headers["Authorization"] = f"Bearer {auth_config['token']}"
    elif 'email' in auth_config and 'key' in auth_config:
         headers["X-Auth-Email"] = auth_config['email']
         headers["X-Auth-Key"] = auth_config['key']

    req = urllib.request.Request(url, method=method, headers=headers)

    if data:
        json_data = json.dumps(data).encode('utf-8')
        req.data = json_data

    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        print(e.read().decode('utf-8'))
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    print("=== Update SPF for Gmail Sending ===")

    env = load_env()
    auth_config = {}

    if 'CLOUDFLARE_API_TOKEN' in env:
        auth_config['token'] = env['CLOUDFLARE_API_TOKEN']
    elif 'CLOUDFLARE_GLOBAL_API_KEY' in env and 'CLOUDFLARE_EMAIL' in env:
        auth_config['key'] = env['CLOUDFLARE_GLOBAL_API_KEY']
        auth_config['email'] = env['CLOUDFLARE_EMAIL']
    else:
        print("Error: No Cloudflare credentials found in .env")
        return

    domain = "chirag127.in"
    # Hardcoded or could be fetched, assuming valid since user confirmed

    # 1. Get Zone ID
    print(f"Finding Zone ID for {domain}...")
    zones = cf_api_request("GET", f"/zones?name={domain}", auth_config)

    if not zones or not zones['success'] or not zones['result']:
        print("Could not find zone.")
        return

    zone_id = zones['result'][0]['id']
    print(f"Zone ID: {zone_id}")

    # 2. Find existing TXT SPF record
    print("Searching for existing SPF record...")
    dns_records = cf_api_request("GET", f"/zones/{zone_id}/dns_records?type=TXT", auth_config)

    spf_record = None
    if dns_records and dns_records['success']:
        for record in dns_records['result']:
            if "v=spf1" in record['content']:
                spf_record = record
                break

    target_spf = "include:_spf.google.com"
    base_spf = "v=spf1 include:_spf.mx.cloudflare.net ~all"

    if spf_record:
        current_content = spf_record['content']
        print(f"Found existing SPF: {current_content}")

        if target_spf in current_content:
            print("SPF already includes Google. No changes needed.")
            return

        # Construct new content
        # Remove ~all or -all from end to append
        clean_content = current_content.replace("~all", "").replace("-all", "").strip()
        new_content = f"{clean_content} {target_spf} ~all"

        print(f"Updating to: {new_content}")

        update_resp = cf_api_request("PUT", f"/zones/{zone_id}/dns_records/{spf_record['id']}", auth_config, {
            "type": "TXT",
            "name": spf_record['name'],
            "content": new_content,
            "ttl": spf_record['ttl']
        })

        if update_resp and update_resp['success']:
            print("Success! SPF record updated.")
        else:
            print("Failed to update record.")

    else:
        print("No SPF record found. Creating new one...")
        new_content = f"v=spf1 include:_spf.mx.cloudflare.net {target_spf} ~all"

        create_resp = cf_api_request("POST", f"/zones/{zone_id}/dns_records", auth_config, {
            "type": "TXT",
            "name": "@",
            "content": new_content,
            "ttl": 3600 # Auto
        })

        if create_resp and create_resp['success']:
            print("Success! Created new SPF record.")
        else:
            print("Failed to create record.")

if __name__ == "__main__":
    main()
