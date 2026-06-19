/**
 * GET /api/now — homepage status strip data source.
 *
 * Phase 2 placeholder. Returns a stable shape so the client component can
 * be developed against. Replace internals with:
 *   - Discord presence: Lanyard public API at https://api.lanyard.rest/v1/users/<DISCORD_USER_ID>
 *   - Now playing:      ListenBrainz at https://api.listenbrainz.org/1/user/<USER>/playing-now
 *   - Weather:          Open-Meteo at https://api.open-meteo.com/v1/forecast?latitude=20.30&longitude=85.82&current_weather=true
 *
 * Cache for 60 s at the edge so we don't pummel Lanyard on every page load.
 */

export interface NowResponse {
  presence: {
    status: 'online' | 'idle' | 'dnd' | 'offline';
    label: string;
  };
  track: { title: string; artist?: string } | null;
  weather: { location: string; temp: number; unit: 'C' | 'F' } | null;
  /** Server timestamp; useful for client-side cache busting if needed. */
  at: string;
}

export async function onRequestGet(_ctx: any): Promise<Response> {
  const body: NowResponse = {
    presence: { status: 'offline', label: 'Status TBD — wire Lanyard' },
    track: null,
    weather: { location: 'Bhubaneswar', temp: 28, unit: 'C' },
    at: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=60',
      'access-control-allow-origin': '*',
    },
  });
}
