"""
Project Me - DNS Manager
Manage Cloudflare DNS records for custom domains
"""

import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()


class DNSManager:
    """Manage Cloudflare DNS records"""

    def __init__(self):
        self.account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
        self.email = os.getenv("CLOUDFLARE_EMAIL")
        self.api_key = os.getenv("CLOUDFLARE_GLOBAL_API_KEY")
        self.headers = {
            "X-Auth-Email": self.email,
            "X-Auth-Key": self.api_key,
            "Content-Type": "application/json"
        }
        self.base_url = "https://api.cloudflare.com/client/v4"

    def get_zones(self) -> list:
        """List all zones in the account"""
        url = f"{self.base_url}/zones"
        response = requests.get(url, headers=self.headers)
        data = response.json()

        if not data.get("success"):
            print(f"❌ Error: {data.get('errors', [])}")
            return []

        return data.get("result", [])

    def get_zone_id(self, domain: str) -> str | None:
        """Get zone ID for a specific domain"""
        zones = self.get_zones()
        for zone in zones:
            if zone["name"] == domain:
                return zone["id"]
        return None

    def list_records(self, zone_id: str) -> list:
        """List all DNS records for a zone"""
        url = f"{self.base_url}/zones/{zone_id}/dns_records"
        response = requests.get(url, headers=self.headers)
        data = response.json()
        return data.get("result", [])

    def add_record(self, zone_id: str, record_type: str, name: str,
                   content: str, proxied: bool = True, ttl: int = 1) -> dict:
        """Add a DNS record"""
        url = f"{self.base_url}/zones/{zone_id}/dns_records"
        data = {
            "type": record_type,
            "name": name,
            "content": content,
            "proxied": proxied,
            "ttl": ttl
        }
        response = requests.post(url, headers=self.headers, json=data)
        return response.json()

    def update_record(self, zone_id: str, record_id: str, record_type: str,
                      name: str, content: str, proxied: bool = True) -> dict:
        """Update an existing DNS record"""
        url = f"{self.base_url}/zones/{zone_id}/dns_records/{record_id}"
        data = {
            "type": record_type,
            "name": name,
            "content": content,
            "proxied": proxied,
            "ttl": 1
        }
        response = requests.put(url, headers=self.headers, json=data)
        return response.json()

    def delete_record(self, zone_id: str, record_id: str) -> dict:
        """Delete a DNS record"""
        url = f"{self.base_url}/zones/{zone_id}/dns_records/{record_id}"
        response = requests.delete(url, headers=self.headers)
        return response.json()

    def find_record(self, zone_id: str, name: str, record_type: str = None) -> dict | None:
        """Find a specific DNS record by name"""
        records = self.list_records(zone_id)
        for record in records:
            if record["name"] == name:
                if record_type is None or record["type"] == record_type:
                    return record
        return None

    def setup_pages_domain(self, subdomain: str, root_domain: str, pages_url: str) -> bool:
        """Setup CNAME for Cloudflare Pages custom domain"""
        zone_id = self.get_zone_id(root_domain)
        if not zone_id:
            print(f"❌ Zone not found: {root_domain}")
            return False

        full_name = f"{subdomain}.{root_domain}" if subdomain else root_domain

        # Check if record exists
        existing = self.find_record(zone_id, full_name, "CNAME")

        if existing:
            print(f"🔄 Updating existing CNAME record...")
            result = self.update_record(
                zone_id, existing["id"], "CNAME", full_name, pages_url
            )
        else:
            print(f"➕ Creating new CNAME record...")
            result = self.add_record(zone_id, "CNAME", full_name, pages_url)

        if result.get("success"):
            print(f"✅ DNS configured: {full_name} -> {pages_url}")
            return True
        else:
            print(f"❌ Failed: {result.get('errors', [])}")
            return False

    def batch_add_records(self, zone_id: str, records: list) -> list:
        """Add multiple DNS records concurrently"""
        results = []
        import concurrent.futures

        print(f"🔄 specific: Batch adding {len(records)} records...")

        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            future_to_record = {
                executor.submit(
                    self.add_record,
                    zone_id,
                    r['type'],
                    r['name'],
                    r['content'],
                    r.get('proxied', True),
                    r.get('ttl', 1)
                ): r
                for r in records
            }

            for future in concurrent.futures.as_completed(future_to_record):
                r = future_to_record[future]
                try:
                    res = future.result()
                    results.append({'record': r, 'result': res, 'success': res.get('success', False)})
                except Exception as exc:
                    print(f"❌ Exception adding record {r['name']}: {exc}")
                    results.append({'record': r, 'result': None, 'success': False, 'error': str(exc)})

        return results

    def batch_delete_records(self, zone_id: str, record_ids: list) -> list:
        """Delete multiple DNS records concurrently"""
        results = []
        import concurrent.futures

        print(f"🔄 specific: Batch deleting {len(record_ids)} records...")

        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            future_to_id = {
                executor.submit(self.delete_record, zone_id, rid): rid
                for rid in record_ids
            }

            for future in concurrent.futures.as_completed(future_to_id):
                rid = future_to_id[future]
                try:
                    res = future.result()
                    results.append({'id': rid, 'result': res, 'success': res.get('success', False)})
                except Exception as exc:
                    print(f"❌ Exception deleting record {rid}: {exc}")
                    results.append({'id': rid, 'result': None, 'success': False, 'error': str(exc)})

        return results


def list_zones():
    """List all zones"""
    dns = DNSManager()
    zones = dns.get_zones()

    print("\n📋 Available Zones:")
    print("-" * 40)
    for zone in zones:
        print(f"  • {zone['name']} (ID: {zone['id'][:8]}...)")


def list_records(domain: str):
    """List all records for a domain"""
    dns = DNSManager()
    zone_id = dns.get_zone_id(domain)

    if not zone_id:
        print(f"❌ Zone not found: {domain}")
        return

    records = dns.list_records(zone_id)

    print(f"\n📋 DNS Records for {domain}:")
    print("-" * 60)
    for record in records:
        proxied = "🟠" if record.get("proxied") else "⚪"
        print(f"  {proxied} {record['type']:6} {record['name']:30} -> {record['content'][:30]}")


def setup_custom_domain(subdomain: str, root_domain: str, pages_url: str):
    """Setup custom domain for Cloudflare Pages"""
    dns = DNSManager()
    dns.setup_pages_domain(subdomain, root_domain, pages_url)


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python dns.py zones              - List all zones")
        print("  python dns.py records <domain>   - List DNS records")
        print("  python dns.py setup <subdomain> <domain> <pages_url>")
        print("")
        print("Example:")
        print("  python dns.py setup me chirag127.in me-791.pages.dev")
        return

    command = sys.argv[1]

    if command == "zones":
        list_zones()
    elif command == "records" and len(sys.argv) >= 3:
        list_records(sys.argv[2])
    elif command == "setup" and len(sys.argv) >= 5:
        setup_custom_domain(sys.argv[2], sys.argv[3], sys.argv[4])
    else:
        print("Invalid command. Run without arguments for help.")


if __name__ == "__main__":
    main()
