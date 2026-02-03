import os
import sys
import json
import urllib.request
import urllib.error

# Cloudflare Email Routing Setup Script
# Usage: python setup_cf_email.py

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
                    # simple strip quotes
                    value = value.strip().strip("'").strip('"')
                    env_vars[key.strip()] = value
    except FileNotFoundError:
        pass
    return env_vars

def get_input(prompt):
    return input(prompt).strip()

def cf_api_request(method, endpoint, auth_config, data=None):
    url = f"https://api.cloudflare.com/client/v4{endpoint}"
    headers = {
        "Content-Type": "application/json"
    }

    # Add appropriate auth headers
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
        error_body = e.read().decode('utf-8')
        print(f"Response body: {error_body}")
        try:
            return json.loads(error_body)
        except json.JSONDecodeError:
            return {"success": False, "errors": [{"message": f"HTTP {e.code}: {error_body}"}]}
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    print("=== Cloudflare Email Routing Setup ===")

    # Load credentials
    env = load_env()
    auth_config = {}

    # Priority 1: API Token (Safer/Modern)
    if 'CLOUDFLARE_API_TOKEN' in env:
        print("Found CLOUDFLARE_API_TOKEN in .env")
        auth_config['token'] = env['CLOUDFLARE_API_TOKEN']
    # Priority 2: Global API Key (Legacy but common)
    elif 'CLOUDFLARE_GLOBAL_API_KEY' in env and 'CLOUDFLARE_EMAIL' in env:
        print("Found CLOUDFLARE_GLOBAL_API_KEY & EMAIL in .env")
        auth_config['key'] = env['CLOUDFLARE_GLOBAL_API_KEY']
        auth_config['email'] = env['CLOUDFLARE_EMAIL']
    else:
        print("No Cloudflare credentials found in .env")
        token = get_input("Enter your Cloudflare API Token: ")
        if token:
            auth_config['token'] = token

    if not auth_config:
        print("No credentials available. Exiting.")
        return

    domain = get_input("Enter your domain name (e.g., chirag127.in): ")
    if not domain:
        print("Domain is required.")
        return

    # 1. Get Zone ID
    print(f"\nFinding Zone ID for {domain}...")
    zones = cf_api_request("GET", f"/zones?name={domain}", auth_config)

    if not zones or not zones['success'] or not zones['result']:
        print("Could not find zone. Check your domain name and credentials.")
        return

    zone_id = zones['result'][0]['id']
    account_id = zones['result'][0]['account']['id']
    print(f"Zone ID: {zone_id}")
    print(f"Account ID: {account_id}")

    # 2. Enable Email Routing
    print("\nEnabling Email Routing...")
    # The correct endpoint to enable is actually adding DNS records
    enable_resp = cf_api_request("POST", f"/zones/{zone_id}/email/routing/dns", auth_config, {})
    if enable_resp and enable_resp['success']:
        print("Email Routing enabled successfully.")
    else:
        # Check if already enabled or other error
        if enable_resp and 'errors' in enable_resp:
             # Often returns error if already enabled, creating a "soft fail"
             print(f"Note: {enable_resp['errors'][0].get('message', 'Unknown error enabling routing')}")
        else:
             print("Email Routing check complete.")

    # 3. Add Destination Address
    dest_email = get_input("\nEnter the destination email address (e.g. chiragsinghal127@gmail.com): ")
    if not dest_email:
        print("Destination email is required.")
        return

    print(f"Adding destination address: {dest_email}...")
    # Using Account level endpoint for destination
    dest_resp = cf_api_request("POST", f"/accounts/{account_id}/email/routing/addresses", auth_config, {"email": dest_email})

    if dest_resp and dest_resp['success']:
        print(f"Destination added! Please check {dest_email} for a verification email.")
        print("You MUST click the verify link in that email before proceeding.")
        input("Press Enter once you have verified the email...")
    else:
        print(f"Note: {dest_email} might already be active. Continuing...")

    # 4. Create Rule (Custom or Catch-All)
    print("\nDo you want to set up specific address or Catch-All?")
    print("1. Specific (e.g. contact@domain.com)")
    print("2. Catch-All (e.g. *@domain.com - everything goes to destination)")
    # Defaulting to 2 as per user request context
    choice = get_input("Enter 1 or 2 (Default: 2): ") or "2"

    if choice == "2":
        print(f"\nSetting up Catch-All for {domain} -> {dest_email}...")
        catch_all_data = {
            "matchers": [{"type": "all"}],
            "actions": [{"type": "forward", "value": [dest_email]}],
            "enabled": True,
            "name": "Catch-All Forwarding"
        }

        # Catch-all endpoint is strictly PUT (update) on the specific endpoint
        rule_resp = cf_api_request("PUT", f"/zones/{zone_id}/email/routing/rules/catch_all", auth_config, catch_all_data)

        if rule_resp and rule_resp['success']:
             print(f"SUCCESS! All emails to *@{domain} will be forwarded to {dest_email}.")
        else:
             print("Failed to update Catch-All rule.")
             if rule_resp: print(rule_resp.get('errors'))

    else:
        custom_prefix = get_input(f"\nEnter the custom email prefix (e.g., 'contact' for contact@{domain}): ")
        if not custom_prefix:
            print("Prefix is required.")
            return

        custom_email = f"{custom_prefix}@{domain}"
        print(f"Creating rule: {custom_email} -> {dest_email}...")

        rule_data = {
            "matchers": [{"type": "literal", "field": "to", "value": custom_email}],
            "actions": [{"type": "forward", "value": [dest_email]}],
            "enabled": True,
            "name": "Forward to Gmail"
        }

        rule_resp = cf_api_request("POST", f"/zones/{zone_id}/email/routing/rules", auth_config, rule_data)

        if rule_resp and rule_resp['success']:
            print(f"SUCCESS! Email sending to {custom_email} is now forwarded to {dest_email}.")
        else:
            print("Failed to create routing rule.")
            if rule_resp: print(rule_resp.get('errors'))

    print("\n=== Setup Complete ===")
    print("Refer to docs/email_setup_guide.md for Part 2: Sending Emails from Gmail.")
    print("Note: If you just verified the email, you might need to wait a minute and run this again if the rule creation failed.")

if __name__ == "__main__":
    main()
