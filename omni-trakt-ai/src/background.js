/**
 * @file Background Service Worker for Omni-Trakt AI
 * The brain of the extension — orchestrates AI identification, Trakt search, and scrobbling.
 *
 * Flow: Content Script → VIDEO_START → AI Identify → Trakt Search → Trakt Scrobble
 */

// Import services (these are loaded as scripts in the service worker context)
// importScripts paths resolve relative to the extension root in MV3 service workers
importScripts(
    'config.js',
    'src/types/index.js',
    'src/services/storage.js',
    'src/services/ai.js',
    'src/services/trakt.js'
);

// ── Current Session State ─────────────────────────────────────
let currentSession = {
    state: ScrobbleState.IDLE,
    pageContext: null,
    identification: null,
    traktMatch: null,
    traktMediaItem: null,
    progress: 0,
    error: null,
    confirmedByUser: false,
};

// ── Message Router ────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender).then(sendResponse);
    return true; // Keep the message channel open for async response
});

/**
 * Route and handle incoming messages
 * @param {Object} message
 * @param {Object} sender
 * @returns {Promise<Object>}
 */
async function handleMessage(message, sender) {
    const { type } = message;

    switch (type) {
        case MessageType.VIDEO_START:
            return await handleVideoStart(message);

        case MessageType.VIDEO_PROGRESS:
            return await handleVideoProgress(message);

        case MessageType.VIDEO_STOP:
            return await handleVideoStop(message);

        case MessageType.VIDEO_PAUSE:
            return await handleVideoPause(message);

        case MessageType.GET_STATE:
            return { state: currentSession };

        case MessageType.TRAKT_LOGIN:
            return await handleTraktLogin();

        case MessageType.TRAKT_LOGOUT:
            return await handleTraktLogout();

        case MessageType.CONFIRM_MATCH:
            return await handleConfirmMatch();

        case MessageType.CORRECT_MATCH:
            return await handleCorrectMatch(message);

        case MessageType.SKIP_SCROBBLE:
            return handleSkipScrobble();

        case MessageType.SAVE_SETTINGS:
            return await handleSaveSettings(message);

        case MessageType.GET_SETTINGS:
            return await handleGetSettings();

        default:
            return { error: `Unknown message type: ${type}` };
    }
}

// ── Video Event Handlers ──────────────────────────────────────

/**
 * Handle VIDEO_START: Run full AI → Trakt identification chain
 * @param {Object} message - { pageContext, progress, videoDuration }
 */
async function handleVideoStart(message) {
    const { pageContext, progress } = message;

    try {
        // Update state: Detecting
        updateState(ScrobbleState.DETECTING, { pageContext, progress });
        broadcastState();

        // Step 1: AI Identification
        updateState(ScrobbleState.IDENTIFYING);
        broadcastState();

        const identification = await identifyContent(pageContext);
        currentSession.identification = identification;

        if (!identification.title || identification.confidence < Config.AI_CONFIDENCE_THRESHOLD) {
            // Low confidence — log locally but don't scrobble
            const logEntry = {
                timestamp: Date.now(),
                pageContext,
                identification,
                action: 'skipped_low_confidence',
            };
            await storageAppendToList(StorageKeys.LOCAL_HISTORY, logEntry);

            updateState(ScrobbleState.IDLE, { error: `AI confidence too low (${identification.confidence}%). ${identification.error || ''}` });
            broadcastState();
            return { state: currentSession };
        }

        // Step 2: Search Trakt for the identified content
        const traktResult = await searchTrakt(identification);
        currentSession.traktMatch = traktResult;

        if (!traktResult) {
            // Not found on Trakt — log locally
            const logEntry = {
                timestamp: Date.now(),
                pageContext,
                identification,
                action: 'not_found_on_trakt',
            };
            await storageAppendToList(StorageKeys.LOCAL_HISTORY, logEntry);

            updateState(ScrobbleState.IDLE, { error: `"${identification.title}" not found on Trakt.` });
            broadcastState();
            return { state: currentSession };
        }

        // Step 3: Build Trakt media item and start scrobble
        const mediaItem = buildTraktMediaItem(identification, traktResult);
        currentSession.traktMediaItem = mediaItem;

        const isAuthed = await traktEnsureAuth();
        if (isAuthed) {
            const scrobbleResult = await traktScrobbleStart(mediaItem, progress);
            if (scrobbleResult) {
                updateState(ScrobbleState.SCROBBLING, { progress });

                // Log successful scrobble
                const logEntry = {
                    timestamp: Date.now(),
                    pageContext,
                    identification,
                    traktMatch: traktResult,
                    action: 'scrobble_started',
                };
                await storageAppendToList(StorageKeys.SCROBBLE_HISTORY, logEntry);
            } else {
                updateState(ScrobbleState.ERROR, { error: 'Failed to start scrobble on Trakt.' });
            }
        } else {
            updateState(ScrobbleState.IDLE, { error: 'Not logged into Trakt.' });
        }

        broadcastState();
        return { state: currentSession };
    } catch (err) {
        console.error('[Omni-Trakt AI] VIDEO_START error:', err);
        updateState(ScrobbleState.ERROR, { error: err.message });
        broadcastState();
        return { state: currentSession };
    }
}

/**
 * Handle VIDEO_PROGRESS: Update scrobble progress on Trakt
 */
async function handleVideoProgress(message) {
    const { progress } = message;
    currentSession.progress = progress;

    if (currentSession.state === ScrobbleState.SCROBBLING && currentSession.traktMediaItem) {
        await traktScrobbleStart(currentSession.traktMediaItem, progress);
    }

    broadcastState();
    return { state: currentSession };
}

/**
 * Handle VIDEO_PAUSE: Pause scrobble on Trakt
 */
async function handleVideoPause(message) {
    const { progress } = message;
    currentSession.progress = progress;

    if (currentSession.state === ScrobbleState.SCROBBLING && currentSession.traktMediaItem) {
        await traktScrobblePause(currentSession.traktMediaItem, progress);
        updateState(ScrobbleState.PAUSED, { progress });
    }

    broadcastState();
    return { state: currentSession };
}

/**
 * Handle VIDEO_STOP: Stop scrobble on Trakt
 */
async function handleVideoStop(message) {
    const { progress } = message;

    if (
        (currentSession.state === ScrobbleState.SCROBBLING || currentSession.state === ScrobbleState.PAUSED) &&
        currentSession.traktMediaItem
    ) {
        await traktScrobbleStop(currentSession.traktMediaItem, progress || 100);
    }

    resetSession();
    broadcastState();
    return { state: currentSession };
}

// ── Trakt Auth Handlers ───────────────────────────────────────

async function handleTraktLogin() {
    const result = await traktLogin();
    broadcastState();
    return result;
}

async function handleTraktLogout() {
    await traktLogout();
    resetSession();
    broadcastState();
    return { success: true };
}

// ── User Action Handlers ──────────────────────────────────────

async function handleConfirmMatch() {
    currentSession.confirmedByUser = true;
    // If we have a match but haven't scrobbled yet, start scrobble now
    if (currentSession.traktMediaItem && currentSession.state !== ScrobbleState.SCROBBLING) {
        const isAuthed = await traktEnsureAuth();
        if (isAuthed) {
            const result = await traktScrobbleStart(currentSession.traktMediaItem, currentSession.progress);
            if (result) {
                updateState(ScrobbleState.SCROBBLING);
            }
        }
    }
    broadcastState();
    return { state: currentSession };
}

async function handleCorrectMatch(message) {
    const { correctedTitle, correctedType, correctedSeason, correctedEpisode } = message;

    // Re-search Trakt with corrected info
    const correctedIdentification = {
        title: correctedTitle,
        type: correctedType || 'movie',
        season: correctedSeason || null,
        episode: correctedEpisode || null,
        year: null,
        confidence: 100,
    };

    currentSession.identification = correctedIdentification;

    const traktResult = await searchTrakt(correctedIdentification);
    if (traktResult) {
        currentSession.traktMatch = traktResult;
        const mediaItem = buildTraktMediaItem(correctedIdentification, traktResult);
        currentSession.traktMediaItem = mediaItem;

        const isAuthed = await traktEnsureAuth();
        if (isAuthed) {
            const result = await traktScrobbleStart(mediaItem, currentSession.progress);
            if (result) {
                updateState(ScrobbleState.SCROBBLING);
            }
        }
    } else {
        updateState(ScrobbleState.IDLE, { error: `"${correctedTitle}" not found on Trakt.` });
    }

    broadcastState();
    return { state: currentSession };
}

function handleSkipScrobble() {
    resetSession();
    broadcastState();
    return { state: currentSession };
}

// ── Settings Handlers ─────────────────────────────────────────

async function handleSaveSettings(message) {
    const { geminiApiKey, traktClientId, traktClientSecret } = message;

    if (geminiApiKey !== undefined) {
        await storageSet(StorageKeys.GEMINI_API_KEY, geminiApiKey);
    }
    if (traktClientId !== undefined) {
        await storageSet(StorageKeys.TRAKT_CLIENT_ID, traktClientId);
    }
    if (traktClientSecret !== undefined) {
        await storageSet(StorageKeys.TRAKT_CLIENT_SECRET, traktClientSecret);
    }

    return { success: true };
}

async function handleGetSettings() {
    const data = await storageGetMultiple([
        StorageKeys.GEMINI_API_KEY,
        StorageKeys.TRAKT_CLIENT_ID,
        StorageKeys.TRAKT_CLIENT_SECRET,
        StorageKeys.TRAKT_USER,
        StorageKeys.TRAKT_TOKEN,
    ]);

    return {
        geminiApiKey: data[StorageKeys.GEMINI_API_KEY] || '',
        traktClientId: data[StorageKeys.TRAKT_CLIENT_ID] || '',
        traktClientSecret: data[StorageKeys.TRAKT_CLIENT_SECRET] || '',
        traktUser: data[StorageKeys.TRAKT_USER] || null,
        isAuthenticated: !!data[StorageKeys.TRAKT_TOKEN],
    };
}

// ── Helpers ───────────────────────────────────────────────────

/**
 * Search Trakt for the AI-identified content
 * @param {Object} identification
 * @returns {Promise<Object|null>}
 */
async function searchTrakt(identification) {
    const { title, type, year } = identification;
    if (!title) return null;

    const searchType = type === 'show' ? 'show' : 'movie';
    return await traktSearch(title, searchType, year);
}

/**
 * Build a Trakt-compatible media item for scrobble API
 * @param {Object} identification - AI result
 * @param {Object} traktResult - Trakt search result
 * @returns {Object}
 */
function buildTraktMediaItem(identification, traktResult) {
    if (identification.type === 'show') {
        const show = traktResult.show || traktResult;
        return {
            show: {
                ids: show.ids || {},
            },
            episode: {
                season: identification.season || 1,
                number: identification.episode || 1,
            },
        };
    } else {
        const movie = traktResult.movie || traktResult;
        return {
            movie: {
                ids: movie.ids || {},
            },
        };
    }
}

/**
 * Update the current session state
 * @param {string} state
 * @param {Object} extra
 */
function updateState(state, extra = {}) {
    currentSession.state = state;
    Object.assign(currentSession, extra);
}

/**
 * Reset session to idle
 */
function resetSession() {
    currentSession = {
        state: ScrobbleState.IDLE,
        pageContext: null,
        identification: null,
        traktMatch: null,
        traktMediaItem: null,
        progress: 0,
        error: null,
        confirmedByUser: false,
    };
}

/**
 * Broadcast current state to all extension pages (popup)
 */
function broadcastState() {
    chrome.runtime.sendMessage({
        type: MessageType.STATE_UPDATE,
        state: currentSession,
    }).catch(() => {
        // Popup might not be open — that's fine
    });
}

// ── Initialize ────────────────────────────────────────────────
console.log('[Omni-Trakt AI] Background service worker initialized.');
