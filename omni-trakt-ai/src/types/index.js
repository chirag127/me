/**
 * @file Shared constants for Omni-Trakt AI
 */

// ── Message Types ───────────────────────────────────────────────
const MessageType = Object.freeze({
    VIDEO_START: 'VIDEO_START',
    VIDEO_PROGRESS: 'VIDEO_PROGRESS',
    VIDEO_STOP: 'VIDEO_STOP',
    VIDEO_PAUSE: 'VIDEO_PAUSE',
    GET_STATE: 'GET_STATE',
    STATE_UPDATE: 'STATE_UPDATE',
    AUTH_STATUS: 'AUTH_STATUS',
    TRAKT_LOGIN: 'TRAKT_LOGIN',
    TRAKT_LOGOUT: 'TRAKT_LOGOUT',
    CONFIRM_MATCH: 'CONFIRM_MATCH',
    CORRECT_MATCH: 'CORRECT_MATCH',
    SKIP_SCROBBLE: 'SKIP_SCROBBLE',
    SAVE_SETTINGS: 'SAVE_SETTINGS',
    GET_SETTINGS: 'GET_SETTINGS',
});

// ── Scrobble States ─────────────────────────────────────────────
const ScrobbleState = Object.freeze({
    IDLE: 'IDLE',
    DETECTING: 'DETECTING',
    IDENTIFYING: 'IDENTIFYING',
    SCROBBLING: 'SCROBBLING',
    PAUSED: 'PAUSED',
    ERROR: 'ERROR',
});

// ── Media Types ─────────────────────────────────────────────────
const MediaType = Object.freeze({
    MOVIE: 'movie',
    SHOW: 'show',
    UNKNOWN: 'unknown',
});

// ── Default Config ──────────────────────────────────────────────
const Config = Object.freeze({
    MIN_PLAY_SECONDS: 30,
    AI_CONFIDENCE_THRESHOLD: 80,
    SCROBBLE_PROGRESS_INTERVAL_MS: 120000, // 2 minutes
    TRAKT_API_URL: 'https://api.trakt.tv',
    TRAKT_AUTH_URL: 'https://trakt.tv/oauth/authorize',
    TRAKT_TOKEN_URL: 'https://api.trakt.tv/oauth/token',
    TRAKT_API_VERSION: '2',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
    GEMINI_MODEL: 'gemma-3-27b-it',
});
