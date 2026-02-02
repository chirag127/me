# Project Me - Deployment Scripts

Python scripts for automated deployment and DNS management.

## Requirements

```bash
pip install requests python-dotenv
```

## Scripts

### `deploy.py` - Multi-Platform Deployment

Deploys to all enabled platforms (Cloudflare, Netlify, Vercel, Surge).

```bash
python scripts/deploy.py
```

Platforms are enabled/disabled via `.env`:
- `ENABLE_CLOUDFLARE=True`
- `ENABLE_NETLIFY=True`
- `ENABLE_VERCEL=True`
- `ENABLE_SURGE=True`

### `dns.py` - Cloudflare DNS Manager

Manage DNS records for custom domains.

```bash
# List all zones
python scripts/dns.py zones

# List DNS records for a domain
python scripts/dns.py records chirag127.in

# Setup custom domain for Cloudflare Pages
python scripts/dns.py setup me chirag127.in me-791.pages.dev
```

## Environment Variables

All credentials are loaded from `.env` in the project root:

```env
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_EMAIL=...
CLOUDFLARE_GLOBAL_API_KEY=...

# Netlify
NETLIFY_AUTH_TOKEN=...
NETLIFY_SITE_ID=...

# Vercel
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...

# Surge
SURGE_TOKEN=...
SURGE_DOMAIN=...
```
