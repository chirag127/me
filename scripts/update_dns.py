import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv("c:/AM/GitHub/me/.env")

# Add the temporary spaceship-api path
sys.path.append("C:/Users/chira/AppData/Local/Temp/spaceship-api-temp")

from spaceship_api.client import SpaceshipApiClient
from spaceship_api.dns_records_types import DNSRecordCNAME, DNSRecordALIAS

TARGET_PAGES_DOMAIN = "chirag127.pages.dev."

def update_domain_records(client, domain_name, target_subs):
    print(f"\n--- Processing {domain_name} ---")
    try:
        records = client.get_dns_records(domain_name)
        print(f"Current records count: {len(records)}")
        
        # Filter existing records to remove any that clash with our targets
        # We also need to preserve all other records (MX, SPF, etc.)
        new_records = []
        for r in records:
            # If the record name is in our target subdomains AND it's a record type we want to replace
            if r.name in target_subs and r.type in ["A", "AAAA", "CNAME", "ALIAS"]:
                print(f"Removing existing {r.type} record for '{r.name}'")
                continue
            new_records.append(r)
            
        # Add new records
        for sub in target_subs:
            if sub == "@":
                print(f"Adding ALIAS record for '@' -> {TARGET_PAGES_DOMAIN}")
                new_records.append(DNSRecordALIAS(type="ALIAS", name="@", aliasName=TARGET_PAGES_DOMAIN, ttl=1800))
            else:
                print(f"Adding CNAME record for '{sub}' -> {TARGET_PAGES_DOMAIN}")
                new_records.append(DNSRecordCNAME(type="CNAME", name=sub, cname=TARGET_PAGES_DOMAIN, ttl=1800))
                
        print(f"Final records to send ({len(new_records)}):")
        for r in new_records:
            print(f" - {r.name} ({r.type})")

        # Send update
        success = client.update_dns_records(domain_name, new_records)
        print(f"Update success for {domain_name}: {success}")
        return success
    except Exception as e:
        print(f"Error updating {domain_name}: {e}")
        return False

def main():
    client = SpaceshipApiClient()
    
    # 1. Update oriz.in subdomains
    oriz_subs = ["me", "chirag", "chirag127"]
    update_domain_records(client, "oriz.in", oriz_subs)
    
    # 2. Update chirag127.in apex and www
    chirag_subs = ["@", "www"]
    update_domain_records(client, "chirag127.in", chirag_subs)

if __name__ == "__main__":
    main()
