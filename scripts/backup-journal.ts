#!/usr/bin/env npx tsx
/**
 * Journal Backup Script
 * Reads all journal entries from Firebase Firestore and backs up to 12 targets:
 * D1, Turso, Supabase, Neon, Xata, CockroachDB, Oracle, MongoDB Atlas,
 * DynamoDB, Appwrite, GitHub (JSON commit)
 *
 * Run: npx tsx scripts/backup-journal.ts
 * Environment variables must be set (see .env.example)
 */

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ============================================================================
// CONFIGURATION
// ============================================================================

const FIREBASE_SERVICE_ACCOUNT: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'fifth-medley-408209',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin
const app = initializeApp({
    credential: cert(FIREBASE_SERVICE_ACCOUNT),
});
const db = getFirestore(app);

interface JournalEntry {
    id: string;
    t?: string;
    d?: string;
    w?: string;
    g?: string;
    h?: string;
    m?: number;
    ts: string; // ISO string
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
    console.log('📥 Reading journal entries from Firestore...');

    const snapshot = await db.collection('journals').orderBy('ts', 'desc').get();
    const entries: JournalEntry[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...(data.t ? { t: data.t } : {}),
            ...(data.d ? { d: data.d } : {}),
            ...(data.w ? { w: data.w } : {}),
            ...(data.g ? { g: data.g } : {}),
            ...(data.h ? { h: data.h } : {}),
            ...(data.m !== undefined ? { m: data.m } : {}),
            ts: data.ts?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
    });

    console.log(`📊 Found ${entries.length} entries`);

    if (entries.length === 0) {
        console.log('⚠️ No entries to backup. Exiting.');
        return;
    }

    // SQL table schema for relational DBs
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS journals (
      id TEXT PRIMARY KEY,
      t TEXT,
      d TEXT,
      w TEXT,
      g TEXT,
      h TEXT,
      m INTEGER,
      ts TEXT NOT NULL
    )`;

    const results: Record<string, string> = {};

    // Run all backups concurrently
    const backups = [
        backup('Cloudflare D1', () => backupToD1(entries, createTableSQL)),
        backup('Turso', () => backupToTurso(entries, createTableSQL)),
        backup('Supabase', () => backupToSupabase(entries)),
        backup('Neon', () => backupToNeon(entries, createTableSQL)),
        backup('Xata', () => backupToXata(entries)),
        backup('CockroachDB', () => backupToCockroach(entries, createTableSQL)),
        backup('Oracle', () => backupToOracle(entries)),
        backup('MongoDB Atlas', () => backupToMongoDB(entries)),
        backup('DynamoDB', () => backupToDynamoDB(entries)),
        backup('Appwrite', () => backupToAppwrite(entries)),
        backup('GitHub', () => backupToGitHub(entries)),
    ];

    const settledResults = await Promise.allSettled(backups);
    settledResults.forEach((r, i) => {
        const name = ['D1', 'Turso', 'Supabase', 'Neon', 'Xata', 'CockroachDB', 'Oracle', 'MongoDB', 'DynamoDB', 'Appwrite', 'GitHub'][i];
        results[name] = r.status === 'fulfilled' ? '✅ Success' : `❌ ${(r as PromiseRejectedResult).reason}`;
    });

    console.log('\n📋 Backup Results:');
    Object.entries(results).forEach(([name, status]) => {
        console.log(`  ${name}: ${status}`);
    });
}

async function backup(name: string, fn: () => Promise<void>): Promise<void> {
    try {
        console.log(`  → Backing up to ${name}...`);
        await fn();
        console.log(`  ✅ ${name} done`);
    } catch (err) {
        console.error(`  ❌ ${name} failed:`, err instanceof Error ? err.message : err);
        throw err;
    }
}

// ============================================================================
// BACKUP TARGETS
// ============================================================================

/** Helper: upsert SQL for relational DBs */
function upsertSQL(entry: JournalEntry): string {
    const vals = [
        `'${entry.id}'`,
        entry.t ? `'${entry.t.replace(/'/g, "''")}'` : 'NULL',
        entry.d ? `'${entry.d.replace(/'/g, "''")}'` : 'NULL',
        entry.w ? `'${entry.w.replace(/'/g, "''")}'` : 'NULL',
        entry.g ? `'${entry.g.replace(/'/g, "''")}'` : 'NULL',
        entry.h ? `'${entry.h.replace(/'/g, "''")}'` : 'NULL',
        entry.m !== undefined ? String(entry.m) : 'NULL',
        `'${entry.ts}'`,
    ].join(', ');
    return `INSERT OR REPLACE INTO journals (id, t, d, w, g, h, m, ts) VALUES (${vals})`;
}

// --- 1. Cloudflare D1 ---
async function backupToD1(entries: JournalEntry[], createSQL: string): Promise<void> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const dbId = process.env.D1_DATABASE_ID;
    if (!accountId || !apiToken || !dbId) throw new Error('Missing CLOUDFLARE env vars');

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;
    const headers = { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' };

    // Create table
    await fetch(url, { method: 'POST', headers, body: JSON.stringify({ sql: createSQL }) });

    // Batch insert (max 100 per request)
    for (let i = 0; i < entries.length; i += 100) {
        const batch = entries.slice(i, i + 100);
        const sql = batch.map((e) => upsertSQL(e)).join('; ');
        await fetch(url, { method: 'POST', headers, body: JSON.stringify({ sql }) });
    }
}

// --- 2. Turso ---
async function backupToTurso(entries: JournalEntry[], createSQL: string): Promise<void> {
    const url = process.env.TURSO_URL;
    const token = process.env.TURSO_AUTH_TOKEN;
    if (!url || !token) throw new Error('Missing TURSO env vars');

    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Create table + insert via pipeline
    const requests = [
        { type: 'execute', stmt: { sql: createSQL } },
        ...entries.map((e) => ({ type: 'execute', stmt: { sql: upsertSQL(e) } })),
        { type: 'close' },
    ];

    await fetch(`${url}/v2/pipeline`, {
        method: 'POST', headers,
        body: JSON.stringify({ requests }),
    });
}

// --- 3. Supabase ---
async function backupToSupabase(entries: JournalEntry[]): Promise<void> {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) throw new Error('Missing SUPABASE env vars');

    // Upsert via REST API
    await fetch(`${url}/rest/v1/journals`, {
        method: 'POST',
        headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(entries),
    });
}

// --- 4. Neon ---
async function backupToNeon(entries: JournalEntry[], createSQL: string): Promise<void> {
    const connStr = process.env.NEON_CONNECTION_STRING;
    if (!connStr) throw new Error('Missing NEON_CONNECTION_STRING');

    const headers = { 'Content-Type': 'application/json' };
    await fetch(`${connStr}/sql`, { method: 'POST', headers, body: JSON.stringify({ query: createSQL }) });

    for (const entry of entries) {
        await fetch(`${connStr}/sql`, {
            method: 'POST', headers,
            body: JSON.stringify({ query: upsertSQL(entry) }),
        });
    }
}

// --- 5. Xata ---
async function backupToXata(entries: JournalEntry[]): Promise<void> {
    const url = process.env.XATA_DB_URL;
    const key = process.env.XATA_API_KEY;
    if (!url || !key) throw new Error('Missing XATA env vars');

    const headers = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

    // Bulk insert/update
    const records = entries.map((e) => ({
        id: e.id,
        ...(e.t ? { t: e.t } : {}),
        ...(e.d ? { d: e.d } : {}),
        ...(e.w ? { w: e.w } : {}),
        ...(e.g ? { g: e.g } : {}),
        ...(e.h ? { h: e.h } : {}),
        ...(e.m !== undefined ? { m: e.m } : {}),
        ts: e.ts,
    }));

    // Xata bulk: max 1000 per request
    for (let i = 0; i < records.length; i += 1000) {
        await fetch(`${url}/tables/journals/bulk`, {
            method: 'POST', headers,
            body: JSON.stringify({ records: records.slice(i, i + 1000) }),
        });
    }
}

// --- 6. CockroachDB ---
async function backupToCockroach(entries: JournalEntry[], createSQL: string): Promise<void> {
    const connStr = process.env.COCKROACH_CONNECTION_STRING;
    if (!connStr) throw new Error('Missing COCKROACH_CONNECTION_STRING');

    const headers = { 'Content-Type': 'application/json' };

    await fetch(connStr, {
        method: 'POST', headers,
        body: JSON.stringify({ statements: [{ sql: createSQL }] }),
    });

    for (const entry of entries) {
        await fetch(connStr, {
            method: 'POST', headers,
            body: JSON.stringify({ statements: [{ sql: upsertSQL(entry) }] }),
        });
    }
}

// --- 7. Oracle ---
async function backupToOracle(entries: JournalEntry[]): Promise<void> {
    const url = process.env.ORACLE_REST_URL;
    const token = process.env.ORACLE_AUTH_TOKEN;
    if (!url || !token) throw new Error('Missing ORACLE env vars');

    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    for (const entry of entries) {
        await fetch(`${url}/journals/`, {
            method: 'POST', headers,
            body: JSON.stringify(entry),
        });
    }
}

// --- 8. MongoDB Atlas ---
async function backupToMongoDB(entries: JournalEntry[]): Promise<void> {
    const url = process.env.MONGODB_DATA_API_URL;
    const key = process.env.MONGODB_API_KEY;
    if (!url || !key) throw new Error('Missing MONGODB env vars');

    const headers = { 'api-key': key, 'Content-Type': 'application/json' };
    const docs = entries.map((e) => ({ _id: e.id, ...e }));

    // Bulk insert via Data API
    for (let i = 0; i < docs.length; i += 100) {
        await fetch(`${url}/action/insertMany`, {
            method: 'POST', headers,
            body: JSON.stringify({
                dataSource: 'Cluster0',
                database: 'journal',
                collection: 'entries',
                documents: docs.slice(i, i + 100),
            }),
        });
    }
}

// --- 9. DynamoDB ---
async function backupToDynamoDB(entries: JournalEntry[]): Promise<void> {
    const region = process.env.AWS_REGION;
    const table = process.env.DYNAMODB_TABLE;
    if (!region || !table) throw new Error('Missing AWS env vars');

    // Using AWS CLI for simplicity in GitHub Actions (aws-actions/configure-aws-credentials)
    const items = entries.map((e) => ({
        PutRequest: {
            Item: {
                id: { S: e.id },
                ...(e.t ? { t: { S: e.t } } : {}),
                ...(e.d ? { d: { S: e.d } } : {}),
                ...(e.w ? { w: { S: e.w } } : {}),
                ...(e.g ? { g: { S: e.g } } : {}),
                ...(e.h ? { h: { S: e.h } } : {}),
                ...(e.m !== undefined ? { m: { N: String(e.m) } } : {}),
                ts: { S: e.ts },
            },
        },
    }));

    // DynamoDB batch write: max 25 items per request
    for (let i = 0; i < items.length; i += 25) {
        const batch = { RequestItems: { [table]: items.slice(i, i + 25) } };
        await fetch(`https://dynamodb.${region}.amazonaws.com`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-amz-json-1.0',
                'X-Amz-Target': 'DynamoDB_20120810.BatchWriteItem',
            },
            body: JSON.stringify(batch),
        });
    }
}

// --- 10. Appwrite ---
async function backupToAppwrite(entries: JournalEntry[]): Promise<void> {
    const endpoint = process.env.APPWRITE_ENDPOINT;
    const projectId = process.env.APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    const dbId = process.env.APPWRITE_DB_ID;
    const collId = process.env.APPWRITE_COLLECTION_ID;
    if (!endpoint || !projectId || !apiKey || !dbId || !collId) throw new Error('Missing APPWRITE env vars');

    const headers = {
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Key': apiKey,
        'Content-Type': 'application/json',
    };

    for (const entry of entries) {
        await fetch(`${endpoint}/databases/${dbId}/collections/${collId}/documents`, {
            method: 'POST', headers,
            body: JSON.stringify({
                documentId: entry.id,
                data: entry,
            }),
        });
    }
}

// --- 11. GitHub (JSON commit) ---
async function backupToGitHub(entries: JournalEntry[]): Promise<void> {
    const repo = process.env.GITHUB_BACKUP_REPO || 'chirag127/me';
    const token = process.env.GH_TOKEN;
    if (!token) throw new Error('Missing GH_TOKEN');

    const path = 'data/journal-backup.json';
    const content = Buffer.from(JSON.stringify(entries, null, 2)).toString('base64');
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'journal-backup-script',
    };

    // Get current file SHA (if exists)
    let sha: string | undefined;
    try {
        const resp = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, { headers });
        if (resp.ok) {
            const data = await resp.json() as { sha: string };
            sha = data.sha;
        }
    } catch {
        // File doesn't exist yet
    }

    // Create/update file
    await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
            message: `chore: daily journal backup (${entries.length} entries) [${new Date().toISOString().slice(0, 10)}]`,
            content,
            ...(sha ? { sha } : {}),
        }),
    });
}

// ============================================================================
// RUN
// ============================================================================

main()
    .then(() => {
        console.log('\n🎉 Backup complete!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n💥 Backup failed:', err);
        process.exit(1);
    });
