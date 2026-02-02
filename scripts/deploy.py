"""
Project Me - Deployment Orchestrator
Handles deployment to multiple platforms and DNS configuration
"""

import os
import subprocess
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
DIST_DIR = Path(__file__).parent.parent / "dist"
PROJECT_NAME = "me"


class CloudflareDeployer:
    """Deploy to Cloudflare Pages and manage DNS"""

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

    def deploy_pages(self) -> dict:
        """Deploy to Cloudflare Pages using wrangler"""
        print("🚀 Deploying to Cloudflare Pages...")

        env = os.environ.copy()
        env["CLOUDFLARE_ACCOUNT_ID"] = self.account_id
        env["CLOUDFLARE_EMAIL"] = self.email
        env["CLOUDFLARE_API_KEY"] = self.api_key

        result = subprocess.run(
            ["npx", "wrangler", "pages", "deploy", str(DIST_DIR),
             "--project-name", PROJECT_NAME, "--branch", "main"],
            capture_output=True,
            text=True,
            env=env,
            cwd=Path(__file__).parent.parent
        )

        if result.returncode == 0:
            print("✅ Cloudflare Pages deployment successful!")
            # Extract URL from output
            for line in result.stdout.split("\n"):
                if "pages.dev" in line:
                    print(f"🌐 URL: {line.strip()}")
        else:
            print(f"❌ Deployment failed: {result.stderr}")

        return {"success": result.returncode == 0, "output": result.stdout}

    def get_zones(self) -> list:
        """Get all DNS zones"""
        url = f"{self.base_url}/zones"
        response = requests.get(url, headers=self.headers)
        data = response.json()
        return data.get("result", [])

    def get_zone_id(self, domain: str) -> str | None:
        """Get zone ID for a domain"""
        zones = self.get_zones()
        for zone in zones:
            if zone["name"] == domain:
                return zone["id"]
        return None

    def add_cname_record(self, zone_id: str, name: str, target: str, proxied: bool = True) -> dict:
        """Add a CNAME record for custom domain"""
        url = f"{self.base_url}/zones/{zone_id}/dns_records"
        data = {
            "type": "CNAME",
            "name": name,
            "content": target,
            "proxied": proxied,
            "ttl": 1  # Auto TTL when proxied
        }
        response = requests.post(url, headers=self.headers, json=data)
        return response.json()

    def setup_custom_domain(self, subdomain: str, root_domain: str, pages_url: str) -> bool:
        """Setup custom domain DNS for Cloudflare Pages"""
        print(f"🔧 Setting up DNS for {subdomain}.{root_domain}...")

        zone_id = self.get_zone_id(root_domain)
        if not zone_id:
            print(f"❌ Zone not found for {root_domain}")
            return False

        # Add CNAME record pointing to pages URL
        result = self.add_cname_record(zone_id, subdomain, pages_url)

        if result.get("success"):
            print(f"✅ DNS record created: {subdomain}.{root_domain} -> {pages_url}")
            return True
        else:
            print(f"❌ DNS setup failed: {result.get('errors', [])}")
            return False

    def list_dns_records(self, zone_id: str) -> list:
        """List all DNS records for a zone"""
        url = f"{self.base_url}/zones/{zone_id}/dns_records"
        response = requests.get(url, headers=self.headers)
        return response.json().get("result", [])


class NetlifyDeployer:
    """Deploy to Netlify"""

    def __init__(self):
        self.auth_token = os.getenv("NETLIFY_AUTH_TOKEN")
        self.site_id = os.getenv("NETLIFY_SITE_ID")

    def deploy(self) -> dict:
        """Deploy to Netlify using CLI"""
        print("🚀 Deploying to Netlify...")

        result = subprocess.run(
            ["npx", "netlify", "deploy", "--prod", "--dir", str(DIST_DIR),
             "--site", self.site_id, "--auth", self.auth_token],
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent.parent
        )

        if result.returncode == 0:
            print("✅ Netlify deployment successful!")
        else:
            print(f"❌ Netlify deployment failed: {result.stderr}")

        return {"success": result.returncode == 0, "output": result.stdout}


class VercelDeployer:
    """Deploy to Vercel"""

    def __init__(self):
        self.token = os.getenv("VERCEL_TOKEN")
        self.org_id = os.getenv("VERCEL_ORG_ID")
        self.project_id = os.getenv("VERCEL_PROJECT_ID")

    def deploy(self) -> dict:
        """Deploy to Vercel using CLI"""
        print("🚀 Deploying to Vercel...")

        env = os.environ.copy()
        env["VERCEL_TOKEN"] = self.token
        env["VERCEL_ORG_ID"] = self.org_id
        env["VERCEL_PROJECT_ID"] = self.project_id

        result = subprocess.run(
            ["npx", "vercel", "--prod", "--yes"],
            capture_output=True,
            text=True,
            env=env,
            cwd=Path(__file__).parent.parent
        )

        if result.returncode == 0:
            print("✅ Vercel deployment successful!")
        else:
            print(f"❌ Vercel deployment failed: {result.stderr}")

        return {"success": result.returncode == 0, "output": result.stdout}


class SurgeDeployer:
    """Deploy to Surge.sh"""

    def __init__(self):
        self.token = os.getenv("SURGE_TOKEN")
        self.domain = os.getenv("SURGE_DOMAIN")

    def deploy(self) -> dict:
        """Deploy to Surge"""
        print("🚀 Deploying to Surge...")

        env = os.environ.copy()
        env["SURGE_TOKEN"] = self.token

        result = subprocess.run(
            ["npx", "surge", str(DIST_DIR), self.domain],
            capture_output=True,
            text=True,
            env=env,
            cwd=Path(__file__).parent.parent
        )

        if result.returncode == 0:
            print(f"✅ Surge deployment successful! URL: https://{self.domain}")
        else:
            print(f"❌ Surge deployment failed: {result.stderr}")

        return {"success": result.returncode == 0, "output": result.stdout}


def build_project() -> bool:
    """Build the project before deployment"""
    print("🔨 Building project...")

    result = subprocess.run(
        ["npm", "run", "build"],
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent.parent
    )

    if result.returncode == 0:
        print("✅ Build successful!")
        return True
    else:
        print(f"❌ Build failed: {result.stderr}")
        return False


def deploy_all():
    """Deploy to all enabled platforms"""
    print("=" * 50)
    print("🚀 Project Me - Deployment Orchestrator")
    print("=" * 50)

    # Build first
    if not build_project():
        print("❌ Build failed, aborting deployment")
        return

    results = {}

    # Cloudflare Pages (primary)
    if os.getenv("ENABLE_CLOUDFLARE", "").lower() == "true":
        cf = CloudflareDeployer()
        results["cloudflare"] = cf.deploy_pages()

    # Netlify
    if os.getenv("ENABLE_NETLIFY", "").lower() == "true":
        netlify = NetlifyDeployer()
        results["netlify"] = netlify.deploy()

    # Vercel
    if os.getenv("ENABLE_VERCEL", "").lower() == "true":
        vercel = VercelDeployer()
        results["vercel"] = vercel.deploy()

    # Surge
    if os.getenv("ENABLE_SURGE", "").lower() == "true":
        surge = SurgeDeployer()
        results["surge"] = surge.deploy()

    # Summary
    print("\n" + "=" * 50)
    print("📊 Deployment Summary")
    print("=" * 50)
    for platform, result in results.items():
        status = "✅" if result.get("success") else "❌"
        print(f"{status} {platform.capitalize()}")


if __name__ == "__main__":
    deploy_all()
