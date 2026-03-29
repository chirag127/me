import path from 'node:path';
import dotenv from 'dotenv';
import fs from 'node:fs';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_GLOBAL_API_KEY;
const CLOUDFLARE_EMAIL = process.env.CLOUDFLARE_EMAIL;

const TARGET_PAGES_DOMAIN = 'chirag127.pages.dev';

const ZONES = {
  'chirag127.in': '954cf759dc65d37f6fa30fcafa899b9a',
  'oriz.in': 'fe8da3c9dd0cb1f1d964e3a94d6098b3'
};

const RECORDS_TO_SET = {
  'chirag127.in': [
    { name: 'chirag127.in', type: 'CNAME', content: TARGET_PAGES_DOMAIN, proxied: true },
    { name: 'www.chirag127.in', type: 'CNAME', content: TARGET_PAGES_DOMAIN, proxied: true },
    { name: 'now.chirag127.in', type: 'DELETE' },
    { name: 'portfolio.chirag127.in', type: 'DELETE' }
  ],
  'oriz.in': [
    { name: 'me.oriz.in', type: 'CNAME', content: TARGET_PAGES_DOMAIN, proxied: true },
    { name: 'chirag.oriz.in', type: 'CNAME', content: TARGET_PAGES_DOMAIN, proxied: true },
    { name: 'chirag127.oriz.in', type: 'CNAME', content: TARGET_PAGES_DOMAIN, proxied: true }
  ]
};

async function api(endpoint: string, method = 'GET', body: any = null) {
  const url = 'https://api.cloudflare.com/client/v4' + endpoint;
  const init: any = {
    method,
    headers: {
      'X-Auth-Email': CLOUDFLARE_EMAIL!,
      'X-Auth-Key': CLOUDFLARE_API_KEY!,
      'Content-Type': 'application/json'
    }
  };
  if (body) init.body = JSON.stringify(body);
  const res = await fetch(url, init);
  const data = await res.json() as any;
  if (!data.success) {
    console.error('API Error:', JSON.stringify(data.errors));
    return null;
  }
  return data.result;
}

async function main() {
  for (const [zoneName, zoneId] of Object.entries(ZONES)) {
    console.log(`\nProcessing zone ${zoneName}...`);
    
    // Get all records
    const records = await api(`/zones/${zoneId}/dns_records?per_page=100`);
    if (!records) continue;

    const targetRecords = RECORDS_TO_SET[zoneName as keyof typeof RECORDS_TO_SET];
    
    for (const target of targetRecords) {
      if (target.type === 'DELETE') {
         console.log(`Checking if ${target.name} exists to DELETE it...`);
         const existing = records.find((r: any) => r.name === target.name);
         if (existing) {
             console.log(`  Deleting record: ${existing.type} ${existing.name} -> ${existing.content}`);
             await api(`/zones/${zoneId}/dns_records/${existing.id}`, 'DELETE');
         } else {
             console.log(`  No existing record found for ${target.name}.`);
         }
         continue;
      }

      console.log(`Setting up ${target.name}...`);
      
      const existing = records.filter((r: any) => r.name === target.name && (r.type === 'A' || r.type === 'AAAA' || r.type === 'CNAME'));
      
      let needsCreate = true;
      for (const rec of existing) {
        if (rec.type === target.type && rec.content === target.content && rec.proxied === target.proxied) {
          console.log(`  Record matches perfectly: ${rec.id}. No action needed.`);
          needsCreate = false;
        } else {
          console.log(`  Deleting conflicting record: ${rec.type} ${rec.name} -> ${rec.content}`);
          await api(`/zones/${zoneId}/dns_records/${rec.id}`, 'DELETE');
        }
      }
      
      if (needsCreate) {
        console.log(`  Creating new ${target.type} record for ${target.name} -> ${target.content}`);
        const res = await api(`/zones/${zoneId}/dns_records`, 'POST', target);
        if (res) console.log(`  Created successfully.`);
      }
    }
  }
  console.log('\nDone.');
}

main().catch(console.error);
