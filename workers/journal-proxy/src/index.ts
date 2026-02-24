/**
 * Journal Proxy Cloudflare Worker
 * Reads journal data from 11 backup databases
 * Single endpoint: GET /read?source=<db_name>
 */

export interface Env {
    // D1 binding
    D1_JOURNAL: D1Database;
    ALLOWED_ORIGIN: string;

    // Turso
    TURSO_URL: string;
    TURSO_AUTH_TOKEN: string;

    // Supabase
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;

    // Neon
    NEON_CONNECTION_STRING: string;

    // Xata
    XATA_API_KEY: string;
    XATA_DB_URL: string;

    // CockroachDB
    COCKROACH_CONNECTION_STRING: string;

    // Oracle
    ORACLE_REST_URL: string;
    ORACLE_AUTH_TOKEN: string;

    // MongoDB Atlas
    MONGODB_DATA_API_URL: string;
    MONGODB_API_KEY: string;

    // DynamoDB
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    DYNAMODB_TABLE: string;

    // Appwrite
    APPWRITE_ENDPOINT: string;
    APPWRITE_PROJECT_ID: string;
    APPWRITE_API_KEY: string;
    APPWRITE_DB_ID: string;
    APPWRITE_COLLECTION_ID: string;

    // GitHub
    GITHUB_BACKUP_REPO: string;
    GITHUB_TOKEN_BACKUP: string;
}

/** Standardized journal entry shape returned by all sources */
interface JournalEntry {
    id: string;
    t?: string;
    d?: string;
    w?: string;
    g?: string;
    h?: string;
    m?: number;
    ts: { seconds: number; nanoseconds: number } | string;
}

type SourceReader = (env: Env) => Promise<JournalEntry[]>;

/** Map of source ID → reader function */
const readers: Record<string, SourceReader> = {
    d1: readFromD1,
    turso: readFromTurso,
    supabase: readFromSupabase,
    neon: readFromNeon,
    xata: readFromXata,
    cockroachdb: readFromCockroach,
    oracle: readFromOracle,
    mongodb: readFromMongoDB,
    dynamodb: readFromDynamoDB,
    appwrite: readFromAppwrite,
    github: readFromGitHub,
};

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const corsHeaders = {
            'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);

        if (url.pathname === '/read' && request.method === 'GET') {
            const source = url.searchParams.get('source') || '';
            const reader = readers[source];

            if (!reader) {
                return Response.json(
                    { error: `Unknown source: ${source}. Valid: ${Object.keys(readers).join(', ')}` },
                    { status: 400, headers: corsHeaders },
                );
            }

            try {
                const entries = await reader(env);
                return Response.json(
                    { entries, source, count: entries.length, fetchedAt: new Date().toISOString() },
                    { headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=300' } },
                );
            } catch (err) {
                return Response.json(
                    { error: `Failed to read from ${source}: ${err instanceof Error ? err.message : 'Unknown'}` },
                    { status: 500, headers: corsHeaders },
                );
            }
        }

        // Health check
        if (url.pathname === '/health') {
            return Response.json({ status: 'ok', sources: Object.keys(readers) }, { headers: corsHeaders });
        }

        return Response.json({ error: 'Not Found. Use GET /read?source=<name>' }, { status: 404, headers: corsHeaders });
    },
};

// ============================================================================
// SOURCE READERS
// ============================================================================

async function readFromD1(env: Env): Promise<JournalEntry[]> {
    const result = await env.D1_JOURNAL.prepare(
        'SELECT id, t, d, w, g, h, m, ts FROM journals ORDER BY ts DESC LIMIT 500',
    ).all();
    return (result.results || []).map((row) => ({
        id: String(row.id),
        t: row.t as string | undefined,
        d: row.d as string | undefined,
        w: row.w as string | undefined,
        g: row.g as string | undefined,
        h: row.h as string | undefined,
        m: row.m as number | undefined,
        ts: String(row.ts),
    }));
}

async function readFromTurso(env: Env): Promise<JournalEntry[]> {
    const resp = await fetch(`${env.TURSO_URL}/v2/pipeline`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.TURSO_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            requests: [
                { type: 'execute', stmt: { sql: 'SELECT id, t, d, w, g, h, m, ts FROM journals ORDER BY ts DESC LIMIT 500' } },
                { type: 'close' },
            ],
        }),
    });
    const data = await resp.json() as { results: { response: { result: { rows: unknown[][] } } }[] };
    const rows = data?.results?.[0]?.response?.result?.rows || [];
    return rows.map((row: unknown[]) => ({
        id: String(row[0]),
        t: row[1] as string | undefined,
        d: row[2] as string | undefined,
        w: row[3] as string | undefined,
        g: row[4] as string | undefined,
        h: row[5] as string | undefined,
        m: row[6] as number | undefined,
        ts: String(row[7]),
    }));
}

async function readFromSupabase(env: Env): Promise<JournalEntry[]> {
    const resp = await fetch(`${env.SUPABASE_URL}/rest/v1/journals?order=ts.desc&limit=500`, {
        headers: {
            apikey: env.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
        },
    });
    return (await resp.json()) as JournalEntry[];
}

async function readFromNeon(env: Env): Promise<JournalEntry[]> {
    // Neon Serverless HTTP API
    const resp = await fetch(`${env.NEON_CONNECTION_STRING}/sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'SELECT id, t, d, w, g, h, m, ts FROM journals ORDER BY ts DESC LIMIT 500' }),
    });
    const data = await resp.json() as { rows: JournalEntry[] };
    return data.rows || [];
}

async function readFromXata(env: Env): Promise<JournalEntry[]> {
    const resp = await fetch(`${env.XATA_DB_URL}/tables/journals/query`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.XATA_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page: { size: 500 }, sort: [{ ts: 'desc' }] }),
    });
    const data = await resp.json() as { records: JournalEntry[] };
    return (data.records || []).map((r) => ({ ...r, id: (r as Record<string, string>).id || '' }));
}

async function readFromCockroach(env: Env): Promise<JournalEntry[]> {
    // CockroachDB Serverless HTTP API
    const resp = await fetch(env.COCKROACH_CONNECTION_STRING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            statements: [{ sql: 'SELECT id, t, d, w, g, h, m, ts FROM journals ORDER BY ts DESC LIMIT 500' }],
        }),
    });
    const data = await resp.json() as { results: { rows: JournalEntry[] }[] };
    return data?.results?.[0]?.rows || [];
}

async function readFromOracle(env: Env): Promise<JournalEntry[]> {
    const resp = await fetch(`${env.ORACLE_REST_URL}/journals/?limit=500&orderby=ts:desc`, {
        headers: { Authorization: `Bearer ${env.ORACLE_AUTH_TOKEN}` },
    });
    const data = await resp.json() as { items: JournalEntry[] };
    return data.items || [];
}

async function readFromMongoDB(env: Env): Promise<JournalEntry[]> {
    const resp = await fetch(`${env.MONGODB_DATA_API_URL}/action/find`, {
        method: 'POST',
        headers: {
            'api-key': env.MONGODB_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dataSource: 'Cluster0',
            database: 'journal',
            collection: 'entries',
            sort: { ts: -1 },
            limit: 500,
        }),
    });
    const data = await resp.json() as { documents: JournalEntry[] };
    return (data.documents || []).map((d) => ({ ...d, id: (d as Record<string, string>)._id || d.id }));
}

async function readFromDynamoDB(env: Env): Promise<JournalEntry[]> {
    // Use AWS DynamoDB HTTP API (Scan operation)
    const body = JSON.stringify({
        TableName: env.DYNAMODB_TABLE,
        Limit: 500,
    });

    const resp = await fetch(`https://dynamodb.${env.AWS_REGION}.amazonaws.com`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-amz-json-1.0',
            'X-Amz-Target': 'DynamoDB_20120810.Scan',
            // Note: In production, use proper AWS Signature V4 signing
            // For simplicity, we rely on AWS credentials being set
        },
        body,
    });
    const data = await resp.json() as { Items: Record<string, { S?: string; N?: string }>[] };
    return (data.Items || []).map((item) => ({
        id: item.id?.S || '',
        t: item.t?.S,
        d: item.d?.S,
        w: item.w?.S,
        g: item.g?.S,
        h: item.h?.S,
        m: item.m?.N ? Number(item.m.N) : undefined,
        ts: item.ts?.S || '',
    }));
}

async function readFromAppwrite(env: Env): Promise<JournalEntry[]> {
    const resp = await fetch(
        `${env.APPWRITE_ENDPOINT}/databases/${env.APPWRITE_DB_ID}/collections/${env.APPWRITE_COLLECTION_ID}/documents?limit=500&orderAttributes[]=ts&orderTypes[]=DESC`,
        {
            headers: {
                'X-Appwrite-Project': env.APPWRITE_PROJECT_ID,
                'X-Appwrite-Key': env.APPWRITE_API_KEY,
            },
        },
    );
    const data = await resp.json() as { documents: JournalEntry[] };
    return (data.documents || []).map((d) => ({
        ...d,
        id: (d as Record<string, string>).$id || d.id,
    }));
}

async function readFromGitHub(env: Env): Promise<JournalEntry[]> {
    const resp = await fetch(
        `https://api.github.com/repos/${env.GITHUB_BACKUP_REPO}/contents/data/journal-backup.json`,
        {
            headers: {
                Authorization: `Bearer ${env.GITHUB_TOKEN_BACKUP}`,
                Accept: 'application/vnd.github.raw+json',
                'User-Agent': 'journal-proxy-worker',
            },
        },
    );
    if (!resp.ok) throw new Error(`GitHub API: ${resp.status}`);
    const data = await resp.json() as JournalEntry[];
    return Array.isArray(data) ? data : [];
}
