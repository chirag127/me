import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import * as dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = 'http://127.0.0.1:3000';
const scopes = 'user-top-read user-read-recently-played';

if (!clientId || !clientSecret) {
  console.error(
    'ERROR: Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env',
  );
  console.log('\nTo get these:');
  console.log('1. Go to https://developer.spotify.com/dashboard');
  console.log('2. Create an app with redirect URI: http://127.0.0.1:3000');
  console.log('3. Copy Client ID and Client Secret to .env');
  process.exit(1);
}

async function getTokens() {
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  console.log('\n1. Go to this URL and authorize:');
  console.log(`   ${authUrl}`);
  console.log(
    '\n2. After authorizing, you will be redirected to 127.0.0.1:3000 (even if it says "site can\'t be reached").',
  );
  console.log('   Copy the `code` parameter from the URL (?code=...)');

  const rl = readline.createInterface({ input, output });
  const code = await rl.question('\n   Enter the code here: ');
  rl.close();

  console.log('\n3. Exchanging code for tokens...');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('Error:', error);
    process.exit(1);
  }

  const tokens = await res.json();

  console.log('\n✅ Success! Add this to your .env file:\n');
  console.log(`SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}`);
}

getTokens();
