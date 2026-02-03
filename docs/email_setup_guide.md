# Guide: Free Custom Domain Email with Cloudflare & Gmail

This guide will help you set up a professional email address (e.g., `contact@yourdomain.com`) for **free** using Cloudflare Email Routing and your existing Gmail account.

## Prerequisites
-   A domain on Cloudflare (You have this!).
-   A Gmail account.
-   (Optional) Cloudflare API Token for the automation script.

---

## Part 1: Receiving Emails (Cloudflare Email Routing)

We will use Cloudflare to forward all emails sent to your custom domain to your Gmail.

### Option A: Manual Setup (Recommended for first time)
1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2.  Select your account and domain (`me`).
3.  Go to **Email** > **Email Routing** in the sidebar.
4.  Click **Get Started**.
5.  **Routes:**
    -   Click **Create address**.
    -   **Custom address:** Enter the prefix you want (e.g., `contact`, `hello`, `me`).
    -   **Destination address:** Enter your personal Gmail address.
    -   Click **Save**.
5b. **(Optional) Catch-All Address:**
    -   If you want *all* emails (e.g., `anything@yourdomain.com`) to go to your Gmail:
    -   Go to **Settings** (in Email Routing).
    -   Find **Catch-all address**.
    -   Enable status to **Active**.
    -   **Action:** Send to Destination -> Select your Gmail.
    -   Click **Save**.
6.  **Verify Destination:**
    -   Check your personal Gmail Inbox for a verification email from Cloudflare.
    -   Click **Verify email address**.
7.  **DNS Records:**
    -   Cloudflare might ask to add DNS records. Click **Add records and enable**.

### Option B: Automated Script
We have provided a script `scripts/setup_cf_email.py`.
1.  Get a Cloudflare API Token with `Zone.Email Routing` permissions.
2.  Run: `python scripts/setup_cf_email.py`
3.  Follow the prompts.

---

## Part 2: Sending Emails (Gmail "Send As")

This trick allows you to reply as `contact@yourdomain.com` from inside Gmail.

1.  **Generate App Password (Google):**
    -   Go to [Google Account Security](https://myaccount.google.com/security).
    -   Enable **2-Step Verification** if not on.
    -   Search for **App passwords**.
    -   Create one named "Cloudflare Email".
    -   **COPY THE 16-CHAR PASSWORD.**

2.  **Configure Gmail:**
    -   Open Gmail on desktop -> **Settings** (⚙️) -> **See all settings**.
    -   Go to **Accounts and Import**.
    -   Under "Send mail as", click **Add another email address**.
    -   **Name:** Your Name.
    -   **Email address:** `contact@yourdomain.com`.
    -   **Treat as an alias:** UNCHECK (Important!).
    -   Click **Next Step**.

3.  **SMTP Settings:**
    -   **SMTP Server:** `smtp.gmail.com`
    -   **Port:** `587`
    -   **Username:** YOUR ACTUAL GMAIL ADDRESS (e.g., `chirag@gmail.com`).
    -   **Password:** The **App Password** you generated (NOT your Gmail password). 

    -   **Secured connection using TLS:** Recommended.
    -   Click **Add Account**.

4.  **Verify:**
    -   Gmail sends a confirmation code to `contact@yourdomain.com`.
    -   Since you set up Cloudflare Routing in Part 1, check your Gmail inbox (it will forward there!).
    -   Enter the code.

---

## Part 3: DNS Optimization (SPF)

To prevent your emails from going to Spam, ensure your SPF record allows Google.
1.  Go to Cloudflare **DNS**.
2.  Edit your `TXT` record for `v=spf1`.
3.  Make sure it includes google:
    `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all`

You are done! You now have a free professional mailbox.
