# 🚀 Multi-Platform Deployment Guide

Chirag's portfolio is designed to be hosted on multiple high-availability and community-driven platforms simultaneously. This guide explains how to set up each platform and get the required API keys for the automated GitHub Actions pipeline.

## 🏗 Essential Commands
- **Build**: `pnpm run build` (Generates `./dist`)
- **Preview**: `pnpm run preview`
- **Lint**: `pnpm exec biome check --apply .`

---

## ☁️ 1. Cloudflare Pages (Primary)
- **Status**: Infinite Bandwidth / High Reliability
- **Steps**:
  1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages**.
  2. Create a new Page from GitHub.
  3. **Build Command**: `pnpm run build`
  4. **Build Output**: `dist`
  5. **Secrets**: Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to GitHub Secrets.

## ⚡ 2. Surge.sh (Fastest)
- **Status**: Quick CLI deployments.
- **Steps**:
  1. Run `npm install -g surge`.
  2. Run `surge token` to get your `SURGE_TOKEN`.
  3. Add `SURGE_LOGIN` (email) and `SURGE_TOKEN` to GitHub Secrets.

## 🐙 3. GitHub Pages
- **Steps**:
  1. Go to Repo **Settings** -> **Pages**.
  2. Set **Build and deployment** -> **Source** to "GitHub Actions".
  3. The `deploy-all.yml` workflow will handle the rest.

## 🔥 4. Firebase Hosting
- **Steps**:
  1. Go to [Firebase Console](https://console.firebase.google.com/).
  2. Activate Hosting for your project.
  3. Run `firebase login:ci` to get `FIREBASE_TOKEN`.
  4. Add to GitHub Secrets.

## 🏰 5. Neocities / Reocities
- **Steps**:
  1. Settings -> **API Key**.
  2. Copy and add `NEOCITIES_API_KEY` to GitHub Secrets.

## 🐱 6. Nekoweb
- **Steps**:
  1. Dashboard -> Settings -> **API Key**.
  2. Add `NEKOWEB_API_KEY` to GitHub Secrets.

## 🛠 7. AppWrite
- **Steps**:
  1. Create a Project -> **Hosting**.
  2. Get `APPWRITE_PROJECT_ID` from Settings.
  3. Create an API Key with `hosting` scope for `APPWRITE_API_KEY`.

## 🌿 8. Sourcehut Pages
- **Steps**:
  1. Go to [meta.sr.ht](https://meta.sr.ht/oauth).
  2. Create a token with `pages:write`.
  3. Add `SOURCEHUT_TOKEN` to GitHub Secrets.

## ❄️ 9. Codeberg / BitBucket
- **Steps**:
  1. Use the **SSH Key** method.
  2. Generate a key: `ssh-keygen -t ed25519`.
  3. Add Public Key to the platform and Private Key to GitHub as `SSH_PRIVATE_KEY`.

---

## 🤖 Automated Deployment
The repository includes a `.github/workflows/deploy-all.yml` (Master Workflow) that automatically triggers on push to `main`. It will parallelize builds and deploy to all configured platforms.

### Environment checklist
Ensure all secrets in `.env.example` marked for "Multi-Platform Deployment" are added to your **GitHub Repository Secrets** (`Settings -> Secrets and variables -> Actions`).
