import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { parse } from 'dotenv';

const envContent = readFileSync('.env', 'utf-8');
const envVars = parse(envContent);

const ghToken = envVars.GH_TOKEN || envVars.GITHUB_TOKEN || envVars.GH_PAT;
if (!ghToken) {
  console.error('No GH_TOKEN found in .env');
  process.exit(1);
}

console.log('Starting GitHub Secrets upload...');

const entries = Object.entries(envVars).filter(
  ([_key, value]) => value.trim() !== '',
);

for (const [key, value] of entries) {
  if (
    key === 'GH_TOKEN' ||
    key === 'GITHUB_TOKEN' ||
    key === 'GITHUB_PERSONAL_ACCESS_TOKEN' ||
    key === 'GH_USERNAME'
  ) {
    continue;
  }

  console.log(`Setting secret: ${key}`);

  // Use spawnSync with a 15 second timeout to prevent hanging on TLS handshake issues
  const result = spawnSync('gh', ['secret', 'set', key, '-b', value], {
    env: { ...process.env, GH_TOKEN: ghToken },
    encoding: 'utf-8',
    timeout: 15000,
  });

  if (result.status === 0) {
    console.log(`✅ Success: ${key}`);
  } else {
    const errorStr = result.error
      ? result.error.message
      : result.stderr || 'Timeout or unknown error';
    console.error(`❌ Failed: ${key} -> ${errorStr}`);
  }
}

console.log('Finished uploading secrets.');
