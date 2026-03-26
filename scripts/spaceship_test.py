import os
from dotenv import load_dotenv

load_dotenv("c:/AM/GitHub/me/.env")

import sys
sys.path.append("C:/Users/chira/AppData/Local/Temp/spaceship-api-temp")

from spaceship_api.client import SpaceshipApiClient
from spaceship_api.dns_records_types import DNSRecordCNAME, DNSRecordALIAS

client = SpaceshipApiClient()
try:
    records = client.get_dns_records("oriz.in")
    print(f"Current records: {len(records)}")
    
    # Filter out me, chirag, chirag127 A/CNAME records
    new_records = []
    for r in records:
        if getattr(r, 'name', '') in ['me', 'chirag', 'chirag127'] and r.type in ['A', 'AAAA', 'CNAME']:
            continue
        new_records.append(r)
        
    print(f"Filtered records: {len(new_records)}")
    
    # Add new records
    new_records.append(DNSRecordCNAME(type="CNAME", name="me", cname="chirag127.pages.dev.", ttl=1800))
    new_records.append(DNSRecordCNAME(type="CNAME", name="chirag", cname="chirag127.pages.dev.", ttl=1800))
    new_records.append(DNSRecordCNAME(type="CNAME", name="chirag127", cname="chirag127.pages.dev.", ttl=1800))
    
    print(f"Total new records: {len(new_records)}")
    
    success = client.update_dns_records("oriz.in", new_records)
    print(f"Update success: {success}")
    
except Exception as e:
    print(f"Exception: {e}")
