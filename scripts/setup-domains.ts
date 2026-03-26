import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_GLOBAL_API_KEY;
const CLOUDFLARE_EMAIL = process.env.CLOUDFLARE_EMAIL;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const SPACESHIP_API_KEY = process.env.SPACESHIP_API_KEY;
const SPACESHIP_API_SECRET = process.env.SPACESHIP_API_SECRET;

const PROJECT_NAME = 'chirag127';
const TARGET_PAGES_DOMAIN = 'chirag127.pages.dev';

const DOMAINS_TO_ADD = [
  'me.oriz.in',
  'chirag127.in',
  'chirag.oriz.in',
  'chirag127.oriz.in',
];

async function addDomainToCloudflarePages(domain: string) {
  console.log(`[Cloudflare] Adding ${domain} to Pages project...`);
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': CLOUDFLARE_EMAIL!,
        'X-Auth-Key': CLOUDFLARE_API_KEY!,
      },
      body: JSON.stringify({ name: domain }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `[Cloudflare] Failed to add ${domain} (${res.status} ${res.statusText}):`,
      text,
    );
    return;
  }
  const data = (await res.json()) as any;
  if (data.success) {
    console.log(`[Cloudflare] Successfully added ${domain}.`);
  } else {
    if (data.errors?.some((e: any) => e.message.includes('already exists'))) {
      console.log(`[Cloudflare] ${domain} is already added to the project.`);
    } else {
      console.error(
        `[Cloudflare] Failed to add ${domain}:`,
        JSON.stringify(data.errors),
      );
    }
  }
}

async function getSpaceshipRecords(rootDomain: string) {
  const url = `https://spaceship.dev/api/v1/dns/records/${rootDomain}?take=100&skip=0`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-Key': SPACESHIP_API_KEY!,
      'X-API-Secret': SPACESHIP_API_SECRET!,
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    console.error(
      `[Spaceship] Failed to fetch records for ${rootDomain}: ${res.status} ${res.statusText}`,
    );
    return [];
  }
  const data = (await res.json()) as any;
  return data.items || [];
}

async function updateSpaceshipRecords(rootDomain: string, records: any[]) {
  const url = `https://spaceship.dev/api/v1/dns/records/${rootDomain}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': SPACESHIP_API_KEY!,
      'X-API-Secret': SPACESHIP_API_SECRET!,
      Accept: 'application/json',
    },
    body: JSON.stringify({ items: records }),
  });
  if (!res.ok) {
    console.error(
      `[Spaceship] Failed to update records for ${rootDomain}: ${res.status} ${res.statusText}`,
    );
    const text = await res.text();
    console.error(text);
    return false;
  }
  console.log(
    `[Spaceship] Successfully updated DNS records for ${rootDomain}.`,
  );
  return true;
}

async function main() {
  if (!CLOUDFLARE_API_KEY || !CLOUDFLARE_EMAIL || !CLOUDFLARE_ACCOUNT_ID) {
    console.error('Missing Cloudflare API environment variables.');
    return;
  }
  if (!SPACESHIP_API_KEY || !SPACESHIP_API_SECRET) {
    console.error('Missing Spaceship API environment variables.');
    return;
  }

  // 1. Add to Cloudflare Pages
  for (const domain of DOMAINS_TO_ADD) {
    await addDomainToCloudflarePages(domain);
  }

  // 2. Map domains to root domains
  // me.oriz.in -> root: oriz.in, sub: me
  // chirag127.in -> root: chirag127.in, sub: @
  const rootDomains = new Map<string, { sub: string; full: string }[]>();

  for (const domain of DOMAINS_TO_ADD) {
    let root = '';
    let sub = '';
    if (domain.endsWith('.oriz.in')) {
      root = 'oriz.in';
      sub = domain.replace('.oriz.in', '');
    } else if (domain === 'chirag127.in') {
      root = 'chirag127.in';
      sub = '@';
    }

    if (!rootDomains.has(root)) {
      rootDomains.set(root, []);
    }
    rootDomains.get(root)?.push({ sub, full: domain });
  }

  for (const [rootDomain, subs] of rootDomains.entries()) {
    console.log(`[Spaceship] Processing root domain: ${rootDomain}`);
    const records = await getSpaceshipRecords(rootDomain);

    let modified = false;
    for (const { sub, full } of subs) {
      // Remove any existing A, AAAA, CNAME, ALIAS for this subdomain
      const originalLength = records.length;
      for (let i = records.length - 1; i >= 0; i--) {
        const r = records[i];
        if (
          r.name === sub &&
          ['A', 'AAAA', 'CNAME', 'ALIAS'].includes(r.type)
        ) {
          records.splice(i, 1);
        }
      }

      if (records.length !== originalLength) {
        modified = true;
      }

      // Add new record
      if (sub === '@') {
        // ALIAS for root
        records.push({
          type: 'ALIAS',
          name: '@',
          aliasName: TARGET_PAGES_DOMAIN,
          ttl: 1800,
        });
        modified = true;
        console.log(
          `[Spaceship] Added ALIAS for ${full} -> ${TARGET_PAGES_DOMAIN}`,
        );
      } else {
        // CNAME for subdomains
        records.push({
          type: 'CNAME',
          name: sub,
          cname: TARGET_PAGES_DOMAIN,
          ttl: 1800,
        });
        modified = true;
        console.log(
          `[Spaceship] Added CNAME for ${full} -> ${TARGET_PAGES_DOMAIN}`,
        );
      }
    }

    if (modified) {
      await updateSpaceshipRecords(rootDomain, records);
    } else {
      console.log(`[Spaceship] No changes needed for ${rootDomain}.`);
    }
  }
}

main().catch(console.error);
