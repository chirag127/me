import * as dotenv from 'dotenv';
import { randomBytes, createHash } from 'node:crypto';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

dotenv.config();

const clientId = process.env.TRAKT_CLIENT_ID;
const clientSecret = process.env.TRAKT_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('ERROR: Missing TRAKT_CLIENT_ID or TRAKT_CLIENT_SECRET in .env');
  console.log('\nTo get these:');
  console.log('1. Go to https://trakt.tv/oauth/applications');
  console.log('2. Create a new app with redirect URI: urn:ietf:wg:oauth:2.0:oob');
  console.log('3. Copy Client ID and Client Secret to .env');
  process.exit(1);
}


const codeVerifier = randomBytes(32).toString('base64url');
const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');

async function getTokens() {
  console.log('\n1. Go to this URL and authorize:');
  console.log(`   https://trakt.tv/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&code_challenge=${codeChallenge}&code_challenge_method=S256`);
  console.log('\n2. Enter the code shown on the page:');
  
  const rl = readline.createInterface({ input, output });
  
  const code = await rl.question('   Code: ');
  rl.close();
  
  console.log('\n3. Exchanging code for tokens...');
  
  const res = await fetch('https://api.trakt.tv/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'trakt-api-version': '2',
      'trakt-api-key': clientId as string
    },
    body: JSON.stringify({
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'authorization_code',
      code_verifier: codeVerifier
    })
  });
  
  if (!res.ok) {
    const error = await res.text();
    console.error('Error:', error);
    process.exit(1);
  }
  
  const tokens = await res.json();
  
  console.log('\n✅ Success! Add these to your .env file:\n');
  console.log(`TRAKT_ACCESS_TOKEN=${tokens.access_token}`);
  console.log(`TRAKT_REFRESH_TOKEN=${tokens.refresh_token}`);
  console.log(`TRAKT_TOKEN_EXPIRES=${Date.now() + (tokens.expires_in * 1000)}`);
  
  console.log('\nAdd these lines to your .env file:');
  console.log('TRAKT_ACCESS_TOKEN=' + tokens.access_token);
  console.log('TRAKT_REFRESH_TOKEN=' + tokens.refresh_token);
}

getTokens();