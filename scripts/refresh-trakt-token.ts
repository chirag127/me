/**
 * Trakt OAuth Token Refresher
 *
 * Run with: npx tsx scripts/refresh-trakt-token.ts
 *
 * This script refreshes the Trakt OAuth access token
 * using the refresh token stored in .env
 * and outputs the new tokens that should be placed
 * back in .env
 */
import * as dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.TRAKT_CLIENT_ID;
const CLIENT_SECRET = process.env.TRAKT_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.TRAKT_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error(
    '❌ Missing TRAKT_CLIENT_ID, TRAKT_CLIENT_SECRET, or TRAKT_REFRESH_TOKEN in .env',
  );
  process.exit(1);
}

async function refreshToken() {
  console.log('🔄 Refreshing Trakt access token...');

  const res = await fetch('https://api.trakt.tv/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    body: JSON.stringify({
      refresh_token: REFRESH_TOKEN,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ Token refresh failed: ${res.status}`);
    console.error(text);

    if (res.status === 401 || res.status === 403) {
      console.log('\n🔑 Refresh token is expired.');
      console.log(
        '   You need to re-authorize. Visit:',
      );
      console.log(
        `   https://trakt.tv/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=urn:ietf:wg:oauth:2.0:oob`,
      );
      console.log(
        '\n   Then run this script with the auth code:',
      );
      console.log(
        '   TRAKT_AUTH_CODE=<your_code> npx tsx scripts/refresh-trakt-token.ts',
      );
    }
    process.exit(1);
  }

  const data = await res.json();
  console.log('✅ Token refreshed successfully!\n');
  console.log(
    'Update these values in your .env file:\n',
  );
  console.log(
    `TRAKT_ACCESS_TOKEN=${data.access_token}`,
  );
  console.log(
    `TRAKT_REFRESH_TOKEN=${data.refresh_token}`,
  );
  console.log(
    `\nToken expires in: ${data.expires_in} seconds (${Math.round(data.expires_in / 86400)} days)`,
  );
}

async function exchangeCode(code: string) {
  console.log(
    '🔄 Exchanging authorization code for tokens...',
  );

  const res = await fetch('https://api.trakt.tv/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    body: JSON.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `❌ Code exchange failed: ${res.status}`,
    );
    console.error(text);
    process.exit(1);
  }

  const data = await res.json();
  console.log('✅ Authorization successful!\n');
  console.log(
    'Update these values in your .env file:\n',
  );
  console.log(
    `TRAKT_ACCESS_TOKEN=${data.access_token}`,
  );
  console.log(
    `TRAKT_REFRESH_TOKEN=${data.refresh_token}`,
  );
  console.log(
    `\nToken expires in: ${data.expires_in} seconds (${Math.round(data.expires_in / 86400)} days)`,
  );
}

// If an auth code was provided, exchange it
const authCode = process.env.TRAKT_AUTH_CODE;
if (authCode) {
  exchangeCode(authCode);
} else {
  refreshToken();
}
