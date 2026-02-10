/**
 * @file Trakt.tv API Service
 * Handles OAuth2 authentication and all Trakt API interactions.
 * User provides their own Trakt client_id and client_secret via the extension settings.
 */

// ── Trakt API Configuration ────────────────────────────────────
const TRAKT_API_URL = 'https://api.trakt.tv';
const TRAKT_AUTH_URL = 'https://trakt.tv/oauth/authorize';
const TRAKT_TOKEN_URL = 'https://api.trakt.tv/oauth/token';
const TRAKT_API_VERSION = '2';

// ── Helper: Build Trakt API headers ─────────────────────────────
async function getTraktHeaders() {
    const token = await storageGet(StorageKeys.TRAKT_TOKEN);
    const clientId = await storageGet(StorageKeys.TRAKT_CLIENT_ID);

    const headers = {
        'Content-Type': 'application/json',
        'trakt-api-version': TRAKT_API_VERSION,
        'trakt-api-key': clientId || '',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

// ── OAuth2 Flow ─────────────────────────────────────────────────

/**
 * Initiates Trakt OAuth2 login flow via chrome.identity.launchWebAuthFlow
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
async function traktLogin() {
    try {
        const clientId = await storageGet(StorageKeys.TRAKT_CLIENT_ID);
        const clientSecret = await storageGet(StorageKeys.TRAKT_CLIENT_SECRET);

        if (!clientId || !clientSecret) {
            return { success: false, error: 'Trakt Client ID and Secret are required. Please set them in Settings.' };
        }

        const redirectUri = chrome.identity.getRedirectURL();
        const authUrl = `${TRAKT_AUTH_URL}?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

        // Launch the auth flow in a browser tab
        const responseUrl = await new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow(
                { url: authUrl, interactive: true },
                (callbackUrl) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(callbackUrl);
                    }
                }
            );
        });

        // Extract the authorization code from the callback URL
        const url = new URL(responseUrl);
        const code = url.searchParams.get('code');
        if (!code) {
            return { success: false, error: 'No authorization code received from Trakt.' };
        }

        // Exchange code for access token
        const tokenResponse = await fetch(TRAKT_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            const errText = await tokenResponse.text();
            return { success: false, error: `Token exchange failed: ${errText}` };
        }

        const tokenData = await tokenResponse.json();

        // Store tokens
        await storageSet(StorageKeys.TRAKT_TOKEN, tokenData.access_token);
        await storageSet(StorageKeys.TRAKT_REFRESH_TOKEN, tokenData.refresh_token);
        await storageSet(StorageKeys.TRAKT_TOKEN_EXPIRY, Date.now() + tokenData.expires_in * 1000);

        // Fetch user profile
        const user = await traktGetUser();
        if (user) {
            await storageSet(StorageKeys.TRAKT_USER, user);
        }

        return { success: true, user };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Logout from Trakt — revoke token and clear storage
 * @returns {Promise<void>}
 */
async function traktLogout() {
    const token = await storageGet(StorageKeys.TRAKT_TOKEN);
    const clientId = await storageGet(StorageKeys.TRAKT_CLIENT_ID);
    const clientSecret = await storageGet(StorageKeys.TRAKT_CLIENT_SECRET);

    // Attempt to revoke the token (best-effort)
    if (token && clientId && clientSecret) {
        try {
            await fetch(`${TRAKT_API_URL}/oauth/revoke`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    client_id: clientId,
                    client_secret: clientSecret,
                }),
            });
        } catch (_) {
            // Silently ignore revoke errors
        }
    }

    await storageRemove(StorageKeys.TRAKT_TOKEN);
    await storageRemove(StorageKeys.TRAKT_REFRESH_TOKEN);
    await storageRemove(StorageKeys.TRAKT_TOKEN_EXPIRY);
    await storageRemove(StorageKeys.TRAKT_USER);
}

/**
 * Check if the Trakt token is still valid, refresh if needed
 * @returns {Promise<boolean>}
 */
async function traktEnsureAuth() {
    const token = await storageGet(StorageKeys.TRAKT_TOKEN);
    if (!token) return false;

    const expiry = await storageGet(StorageKeys.TRAKT_TOKEN_EXPIRY);
    if (expiry && Date.now() > expiry - 300000) {
        // Token expires within 5 minutes, try to refresh
        return await traktRefreshToken();
    }

    return true;
}

/**
 * Refresh the Trakt access token using the refresh token
 * @returns {Promise<boolean>}
 */
async function traktRefreshToken() {
    try {
        const refreshToken = await storageGet(StorageKeys.TRAKT_REFRESH_TOKEN);
        const clientId = await storageGet(StorageKeys.TRAKT_CLIENT_ID);
        const clientSecret = await storageGet(StorageKeys.TRAKT_CLIENT_SECRET);

        if (!refreshToken || !clientId || !clientSecret) return false;

        const response = await fetch(TRAKT_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: chrome.identity.getRedirectURL(),
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) return false;

        const data = await response.json();
        await storageSet(StorageKeys.TRAKT_TOKEN, data.access_token);
        await storageSet(StorageKeys.TRAKT_REFRESH_TOKEN, data.refresh_token);
        await storageSet(StorageKeys.TRAKT_TOKEN_EXPIRY, Date.now() + data.expires_in * 1000);

        return true;
    } catch (_) {
        return false;
    }
}

// ── Trakt User ──────────────────────────────────────────────────

/**
 * Fetch the current Trakt user profile
 * @returns {Promise<Object|null>}
 */
async function traktGetUser() {
    try {
        const headers = await getTraktHeaders();
        const response = await fetch(`${TRAKT_API_URL}/users/me`, { headers });
        if (!response.ok) return null;
        return await response.json();
    } catch (_) {
        return null;
    }
}

// ── Search ──────────────────────────────────────────────────────

/**
 * Search Trakt for a movie or show
 * @param {string} query - Search query (title)
 * @param {'movie'|'show'} type - Media type
 * @param {number|null} year - Optional year filter
 * @returns {Promise<Object|null>} Best match or null
 */
async function traktSearch(query, type = 'movie', year = null) {
    try {
        if (!(await traktEnsureAuth())) return null;

        const headers = await getTraktHeaders();
        let url = `${TRAKT_API_URL}/search/${type}?query=${encodeURIComponent(query)}`;
        if (year) url += `&years=${year}`;

        const response = await fetch(url, { headers });
        if (!response.ok) return null;

        const results = await response.json();
        if (results.length === 0) return null;

        // Return the top result
        return results[0];
    } catch (_) {
        return null;
    }
}

// ── Scrobble ────────────────────────────────────────────────────

/**
 * Start a scrobble on Trakt
 * @param {Object} mediaItem - The Trakt media item { movie: {...} } or { show: {...}, episode: {...} }
 * @param {number} progress - Playback progress 0-100
 * @returns {Promise<Object|null>}
 */
async function traktScrobbleStart(mediaItem, progress = 0) {
    return _traktScrobble('start', mediaItem, progress);
}

/**
 * Pause a scrobble on Trakt
 * @param {Object} mediaItem
 * @param {number} progress
 * @returns {Promise<Object|null>}
 */
async function traktScrobblePause(mediaItem, progress = 0) {
    return _traktScrobble('pause', mediaItem, progress);
}

/**
 * Stop a scrobble on Trakt
 * @param {Object} mediaItem
 * @param {number} progress
 * @returns {Promise<Object|null>}
 */
async function traktScrobbleStop(mediaItem, progress = 100) {
    return _traktScrobble('stop', mediaItem, progress);
}

/**
 * Internal scrobble request handler
 * @param {'start'|'pause'|'stop'} action
 * @param {Object} mediaItem
 * @param {number} progress
 * @returns {Promise<Object|null>}
 */
async function _traktScrobble(action, mediaItem, progress) {
    try {
        if (!(await traktEnsureAuth())) return null;

        const headers = await getTraktHeaders();
        const body = {
            ...mediaItem,
            progress: Math.min(100, Math.max(0, progress)),
        };

        const response = await fetch(`${TRAKT_API_URL}/scrobble/${action}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.warn(`[Omni-Trakt AI] Scrobble ${action} failed:`, response.status);
            return null;
        }

        return await response.json();
    } catch (err) {
        console.error(`[Omni-Trakt AI] Scrobble ${action} error:`, err);
        return null;
    }
}
