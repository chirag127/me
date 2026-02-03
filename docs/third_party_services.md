# Third-Party Services Configuration

This document describes all third-party services integrated into this website, their configuration, and setup requirements.

## Overview

Services are organized into categories:
- **Analytics** - Traffic and behavior tracking
- **Firebase** - Backend services (Auth, Database, Storage)
- **Engagement** - Comments, Chat, Social, Notifications
- **Communication** - Forms and Email
- **Utility** - Security and Performance

---

## Currently Enabled Services

| Service | Category | Free Tier | Status |
|---------|----------|-----------|--------|
| Firebase | BaaS | 50k MAU, 1GB DB | ✅ Enabled |
| Giscus | Comments | Unlimited | ✅ Enabled |
| Tawk.to | Live Chat | Unlimited | ✅ Enabled |
| AddToAny | Social Share | Unlimited | ✅ Enabled |
| Novu | Notifications | 10k events/mo | ✅ Enabled |
| GrowthBook | A/B Testing | 1M requests/mo | ✅ Enabled |
| Poptin | Popups | 1k visitors/mo | ✅ Enabled |
| Google Forms | Forms | Unlimited | ✅ Enabled |

---

## Domain-Specific Services (Need Setup)

These services require tokens generated specifically for your domain. They are **disabled by default**.

### Microsoft Clarity
**Purpose:** Heatmaps and session recordings (different from GA4)

**Setup:**
1. Go to [clarity.microsoft.com](https://clarity.microsoft.com)
2. Create new project for your domain
3. Copy the Project ID
4. Update `src/config/services/analytics.ts`:
   ```typescript
   clarity: {
       projectId: 'YOUR_PROJECT_ID',
       enabled: true
   }
   ```

### Google Analytics 4
**Purpose:** Traffic and conversion analytics

**Setup:**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property > Data Streams > Web
3. Copy Measurement ID (G-XXXXXXXXXX)
4. Update `src/config/services/analytics.ts`:
   ```typescript
   ga4: {
       measurementId: 'G-XXXXXXXXXX',
       enabled: true
   }
   ```

### EmailJS
**Purpose:** Send emails from client-side JavaScript

**Setup:**
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Add email service (Gmail, etc.) → Copy Service ID
3. Create email template → Copy Template ID
4. Account → Copy Public Key
5. Update `src/config/services/communication.ts`:
   ```typescript
   emailjs: {
       serviceId: 'YOUR_SERVICE_ID',
       templateId: 'YOUR_TEMPLATE_ID',
       publicKey: 'YOUR_PUBLIC_KEY',
       enabled: true
   }
   ```

### hCaptcha / reCAPTCHA
**Purpose:** Bot protection for forms

**hCaptcha Setup:**
1. Sign up at [hcaptcha.com](https://www.hcaptcha.com)
2. Add your domain
3. Copy site key
4. Update `src/config/services/utility.ts`

---

## File Structure

```
src/
├── config/
│   └── services.ts       # All service configurations
├── services/
│   └── init.ts           # Service initialization code
└── main.ts               # Imports and calls initServices()
```

## Usage

```typescript
// In main.ts (already integrated)
import { initServices } from './services/init';
initServices(); // Called on app startup

// To add Giscus comments to a page:
import { initGiscus } from './services/init';
const container = document.getElementById('comments');
if (container) initGiscus(container);

// To add share buttons:
import { createShareButtons } from './services/init';
element.innerHTML = createShareButtons();

// To track events:
import { trackEvent, trackPageView } from './services/init';
trackPageView('/me/about', 'About Page');
trackEvent('button_click', { button_id: 'contact' });
```

---

## Security Notes

1. **Public Tokens Only:** All tokens in these files are safe for client-side JavaScript
2. **Firebase Security:** Firebase security is handled via Security Rules, not by hiding API keys
3. **Private Tokens:** Any private/secret tokens should be in `.env` file only

---

## Excluded Services (Monetization)

The following categories are intentionally excluded:
- Advertising (display, native, video, crypto ads)
- Affiliate marketing
- Donations (fiat and crypto)
- URL shorteners with ads
- Offerwalls and paywalls
- Browser mining
