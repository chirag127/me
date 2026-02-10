/**
 * @file Popup UI Controller for Omni-Trakt AI
 * Manages the popup interface — tabs, state display, auth, settings, history.
 */

// ── Message Types (mirrored from types/index.js for popup context) ─────
const MSG = Object.freeze({
    VIDEO_START: 'VIDEO_START',
    VIDEO_PROGRESS: 'VIDEO_PROGRESS',
    VIDEO_STOP: 'VIDEO_STOP',
    VIDEO_PAUSE: 'VIDEO_PAUSE',
    GET_STATE: 'GET_STATE',
    STATE_UPDATE: 'STATE_UPDATE',
    TRAKT_LOGIN: 'TRAKT_LOGIN',
    TRAKT_LOGOUT: 'TRAKT_LOGOUT',
    CONFIRM_MATCH: 'CONFIRM_MATCH',
    CORRECT_MATCH: 'CORRECT_MATCH',
    SKIP_SCROBBLE: 'SKIP_SCROBBLE',
    SAVE_SETTINGS: 'SAVE_SETTINGS',
    GET_SETTINGS: 'GET_SETTINGS',
});

const STATE = Object.freeze({
    IDLE: 'IDLE',
    DETECTING: 'DETECTING',
    IDENTIFYING: 'IDENTIFYING',
    SCROBBLING: 'SCROBBLING',
    PAUSED: 'PAUSED',
    ERROR: 'ERROR',
});

// ── DOM Elements ──────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
    // Header
    statusBadge: $('#statusBadge'),
    // Auth
    authBanner: $('#authBanner'),
    authAvatar: $('#authAvatar'),
    authName: $('#authName'),
    btnTraktAuth: $('#btnTraktAuth'),
    // Detection
    detectionCard: $('#detectionCard'),
    stateIcon: $('#stateIcon'),
    stateLabel: $('#stateLabel'),
    stateSub: $('#stateSub'),
    nowPlaying: $('#nowPlaying'),
    mediaTitle: $('#mediaTitle'),
    mediaMeta: $('#mediaMeta'),
    confidenceFill: $('#confidenceFill'),
    confidenceValue: $('#confidenceValue'),
    progressFill: $('#progressFill'),
    progressValue: $('#progressValue'),
    actions: $('#actions'),
    errorMsg: $('#errorMsg'),
    // Actions
    btnConfirm: $('#btnConfirm'),
    btnCorrect: $('#btnCorrect'),
    btnSkip: $('#btnSkip'),
    // Correction Modal
    correctionModal: $('#correctionModal'),
    correctTitle: $('#correctTitle'),
    correctType: $('#correctType'),
    correctSeason: $('#correctSeason'),
    correctEpisode: $('#correctEpisode'),
    episodeFields: $('#episodeFields'),
    btnSubmitCorrection: $('#btnSubmitCorrection'),
    btnCancelCorrection: $('#btnCancelCorrection'),
    // History
    historyList: $('#historyList'),
    // Settings
    settingGeminiKey: $('#settingGeminiKey'),
    settingTraktClientId: $('#settingTraktClientId'),
    settingTraktSecret: $('#settingTraktSecret'),
    btnSaveSettings: $('#btnSaveSettings'),
    settingsStatus: $('#settingsStatus'),
};

// ── Tab Navigation ────────────────────────────────────────────
$$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
        $$('.tab').forEach((t) => t.classList.remove('active'));
        $$('.tab-content').forEach((c) => c.classList.remove('active'));
        tab.classList.add('active');
        const targetId = `tab-${tab.dataset.tab}`;
        $(`#${targetId}`).classList.add('active');

        // Load data when switching tabs
        if (tab.dataset.tab === 'history') loadHistory();
        if (tab.dataset.tab === 'settings') loadSettings();
    });
});

// ── History Sub-tabs ──────────────────────────────────────────
let currentHistoryTab = 'scrobbled';

$$('.history-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
        $$('.history-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        currentHistoryTab = tab.dataset.history;
        loadHistory();
    });
});

// ── State Updates ─────────────────────────────────────────────

/**
 * Update the UI to reflect the current session state
 * @param {Object} session - Current session state from background
 */
function updateUI(session) {
    if (!session) return;

    const { state, identification, progress, error } = session;

    // Update badge
    updateBadge(state);

    // Update state display
    updateDetectionState(state, identification, error);

    // Update now playing
    if (identification && identification.title) {
        showNowPlaying(identification, progress);
    } else {
        dom.nowPlaying.classList.add('hidden');
    }

    // Show/hide actions
    if (state === STATE.SCROBBLING || state === STATE.IDENTIFYING || state === STATE.DETECTING) {
        dom.actions.classList.remove('hidden');
    } else {
        dom.actions.classList.add('hidden');
    }

    // Show/hide error
    if (error && state !== STATE.SCROBBLING) {
        dom.errorMsg.textContent = error;
        dom.errorMsg.classList.remove('hidden');
    } else {
        dom.errorMsg.classList.add('hidden');
    }
}

/**
 * Update the header status badge
 */
function updateBadge(state) {
    const badge = dom.statusBadge;
    badge.className = 'header-badge';

    switch (state) {
        case STATE.SCROBBLING:
            badge.textContent = '🟢 SCROBBLING';
            badge.classList.add('scrobbling');
            break;
        case STATE.IDENTIFYING:
            badge.textContent = '🔮 IDENTIFYING';
            badge.classList.add('identifying');
            break;
        case STATE.DETECTING:
            badge.textContent = '👁️ DETECTING';
            badge.classList.add('identifying');
            break;
        case STATE.PAUSED:
            badge.textContent = '⏸ PAUSED';
            badge.classList.add('paused');
            break;
        case STATE.ERROR:
            badge.textContent = '⚠ ERROR';
            badge.classList.add('error');
            break;
        default:
            badge.textContent = 'IDLE';
            break;
    }
}

/**
 * Update the detection state icon and text
 */
function updateDetectionState(state, identification, error) {
    switch (state) {
        case STATE.IDLE:
            dom.stateIcon.textContent = '⏸️';
            dom.stateLabel.textContent = 'No video detected';
            dom.stateSub.textContent = error || 'Browse to a page with a video to start';
            break;
        case STATE.DETECTING:
            dom.stateIcon.innerHTML = '<span class="spin">🔄</span>';
            dom.stateLabel.textContent = 'Video detected!';
            dom.stateSub.textContent = 'Waiting for minimum playback...';
            break;
        case STATE.IDENTIFYING:
            dom.stateIcon.innerHTML = '<span class="spin">🔮</span>';
            dom.stateLabel.textContent = 'Analyzing with AI...';
            dom.stateSub.textContent = 'Gemma 27B is identifying the content';
            break;
        case STATE.SCROBBLING:
            dom.stateIcon.textContent = '🎬';
            dom.stateLabel.textContent = 'Scrobbling to Trakt!';
            dom.stateSub.textContent = identification ? `"${identification.title}"` : '';
            break;
        case STATE.PAUSED:
            dom.stateIcon.textContent = '⏸️';
            dom.stateLabel.textContent = 'Playback paused';
            dom.stateSub.textContent = identification ? `"${identification.title}"` : '';
            break;
        case STATE.ERROR:
            dom.stateIcon.textContent = '⚠️';
            dom.stateLabel.textContent = 'Error';
            dom.stateSub.textContent = error || 'Something went wrong';
            break;
    }
}

/**
 * Show the now playing section with identification details
 */
function showNowPlaying(identification, progress) {
    dom.nowPlaying.classList.remove('hidden');
    dom.mediaTitle.textContent = identification.title;

    // Build metadata text
    const metaParts = [];
    if (identification.type === 'show') {
        metaParts.push('📺 TV Show');
        if (identification.season != null) metaParts.push(`S${String(identification.season).padStart(2, '0')}`);
        if (identification.episode != null) metaParts.push(`E${String(identification.episode).padStart(2, '0')}`);
    } else {
        metaParts.push('🎬 Movie');
    }
    if (identification.year) metaParts.push(`(${identification.year})`);
    dom.mediaMeta.textContent = metaParts.join(' · ');

    // Confidence bar
    const conf = identification.confidence || 0;
    dom.confidenceFill.style.width = `${conf}%`;
    dom.confidenceValue.textContent = `${conf}%`;

    // Change color based on confidence
    if (conf >= 80) {
        dom.confidenceFill.style.background = 'var(--gradient-success)';
    } else if (conf >= 50) {
        dom.confidenceFill.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';
    } else {
        dom.confidenceFill.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }

    // Progress bar
    dom.progressFill.style.width = `${progress || 0}%`;
    dom.progressValue.textContent = `${progress || 0}%`;
}

// ── Auth ───────────────────────────────────────────────────────

/**
 * Update auth display based on settings
 */
async function updateAuthDisplay() {
    try {
        const settings = await sendMessage({ type: MSG.GET_SETTINGS });
        if (settings && settings.isAuthenticated && settings.traktUser) {
            const user = settings.traktUser;
            dom.authName.textContent = user.username || user.user?.username || 'Connected';
            dom.authName.classList.add('connected');
            dom.btnTraktAuth.textContent = 'Logout';
            dom.btnTraktAuth.classList.remove('btn-trakt');
            dom.btnTraktAuth.classList.add('btn-skip');

            // Show avatar if available
            if (user.images?.avatar?.full) {
                dom.authAvatar.innerHTML = `<img src="${user.images.avatar.full}" alt="avatar">`;
            } else {
                dom.authAvatar.textContent = (user.username || 'U')[0].toUpperCase();
            }
        } else {
            dom.authName.textContent = 'Not connected';
            dom.authName.classList.remove('connected');
            dom.btnTraktAuth.textContent = 'Sign in with Trakt';
            dom.btnTraktAuth.classList.add('btn-trakt');
            dom.btnTraktAuth.classList.remove('btn-skip');
            dom.authAvatar.textContent = '?';
        }
    } catch (err) {
        console.error('Auth display error:', err);
    }
}

dom.btnTraktAuth.addEventListener('click', async () => {
    const isLogout = dom.btnTraktAuth.textContent === 'Logout';

    dom.btnTraktAuth.disabled = true;
    dom.btnTraktAuth.textContent = isLogout ? 'Logging out...' : 'Connecting...';

    try {
        if (isLogout) {
            await sendMessage({ type: MSG.TRAKT_LOGOUT });
        } else {
            const result = await sendMessage({ type: MSG.TRAKT_LOGIN });
            if (result && !result.success) {
                dom.errorMsg.textContent = result.error || 'Login failed';
                dom.errorMsg.classList.remove('hidden');
            }
        }
    } catch (err) {
        dom.errorMsg.textContent = err.message;
        dom.errorMsg.classList.remove('hidden');
    }

    dom.btnTraktAuth.disabled = false;
    await updateAuthDisplay();
});

// ── Action Buttons ────────────────────────────────────────────

dom.btnConfirm.addEventListener('click', async () => {
    await sendMessage({ type: MSG.CONFIRM_MATCH });
});

dom.btnSkip.addEventListener('click', async () => {
    await sendMessage({ type: MSG.SKIP_SCROBBLE });
});

dom.btnCorrect.addEventListener('click', () => {
    dom.correctionModal.classList.remove('hidden');
    // Pre-fill from current identification
    const state = latestState;
    if (state?.identification) {
        dom.correctTitle.value = state.identification.title || '';
        dom.correctType.value = state.identification.type === 'show' ? 'show' : 'movie';
        dom.correctSeason.value = state.identification.season || '';
        dom.correctEpisode.value = state.identification.episode || '';
        toggleEpisodeFields();
    }
});

dom.correctType.addEventListener('change', toggleEpisodeFields);

function toggleEpisodeFields() {
    if (dom.correctType.value === 'show') {
        dom.episodeFields.classList.remove('hidden');
    } else {
        dom.episodeFields.classList.add('hidden');
    }
}

dom.btnSubmitCorrection.addEventListener('click', async () => {
    const title = dom.correctTitle.value.trim();
    if (!title) return;

    await sendMessage({
        type: MSG.CORRECT_MATCH,
        correctedTitle: title,
        correctedType: dom.correctType.value,
        correctedSeason: dom.correctSeason.value ? parseInt(dom.correctSeason.value) : null,
        correctedEpisode: dom.correctEpisode.value ? parseInt(dom.correctEpisode.value) : null,
    });

    dom.correctionModal.classList.add('hidden');
});

dom.btnCancelCorrection.addEventListener('click', () => {
    dom.correctionModal.classList.add('hidden');
});

// ── Settings ──────────────────────────────────────────────────

async function loadSettings() {
    try {
        const settings = await sendMessage({ type: MSG.GET_SETTINGS });
        if (settings) {
            dom.settingGeminiKey.value = settings.geminiApiKey || '';
            dom.settingTraktClientId.value = settings.traktClientId || '';
            dom.settingTraktSecret.value = settings.traktClientSecret || '';
        }
    } catch (err) {
        console.error('Load settings error:', err);
    }
}

dom.btnSaveSettings.addEventListener('click', async () => {
    dom.btnSaveSettings.disabled = true;
    dom.btnSaveSettings.textContent = 'Saving...';

    try {
        await sendMessage({
            type: MSG.SAVE_SETTINGS,
            geminiApiKey: dom.settingGeminiKey.value.trim(),
            traktClientId: dom.settingTraktClientId.value.trim(),
            traktClientSecret: dom.settingTraktSecret.value.trim(),
        });

        dom.settingsStatus.classList.remove('hidden');
        setTimeout(() => dom.settingsStatus.classList.add('hidden'), 2500);
    } catch (err) {
        console.error('Save settings error:', err);
    }

    dom.btnSaveSettings.disabled = false;
    dom.btnSaveSettings.textContent = '💾 Save Settings';
});

// ── History ───────────────────────────────────────────────────

async function loadHistory() {
    try {
        const storageKey = currentHistoryTab === 'scrobbled' ? 'scrobble_history' : 'local_history';
        const items = await new Promise((resolve) => {
            chrome.storage.local.get([storageKey], (result) => {
                resolve(result[storageKey] || []);
            });
        });

        if (items.length === 0) {
            dom.historyList.innerHTML = '<p class="empty-state">No history yet. Start watching something!</p>';
            return;
        }

        dom.historyList.innerHTML = items
            .slice(0, 50)
            .map((item) => {
                const icon = item.action === 'scrobble_started' ? '✅' : item.action === 'skipped_low_confidence' ? '⚠️' : '📋';
                const title = item.identification?.title || 'Unknown';
                const type = item.identification?.type === 'show' ? 'TV Show' : 'Movie';
                const confidence = item.identification?.confidence || 0;
                const time = formatTimeAgo(item.timestamp);
                const actionText = item.action === 'scrobble_started' ? 'Scrobbled' : item.action === 'skipped_low_confidence' ? `Skipped (${confidence}% conf)` : item.action;

                return `
          <div class="history-item">
            <span class="history-icon">${icon}</span>
            <div class="history-details">
              <div class="history-title" title="${escapeHtml(title)}">${escapeHtml(title)}</div>
              <div class="history-sub">${type} · ${actionText}</div>
            </div>
            <span class="history-time">${time}</span>
          </div>
        `;
            })
            .join('');
    } catch (err) {
        console.error('Load history error:', err);
        dom.historyList.innerHTML = '<p class="empty-state">Error loading history.</p>';
    }
}

// ── Utilities ─────────────────────────────────────────────────

/**
 * Send a message to the background service worker
 * @param {Object} message
 * @returns {Promise<any>}
 */
function sendMessage(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(response);
            }
        });
    });
}

/**
 * Format a timestamp as relative time
 * @param {number} timestamp - Unix timestamp in ms
 * @returns {string}
 */
function formatTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

/**
 * Escape HTML to prevent XSS in rendered content
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ── State Listener ────────────────────────────────────────────

let latestState = null;

// Listen for real-time state updates from background
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'STATE_UPDATE' && message.state) {
        latestState = message.state;
        updateUI(message.state);
    }
});

// ── Initialize Popup ──────────────────────────────────────────

async function init() {
    // Get current state from background
    try {
        const response = await sendMessage({ type: MSG.GET_STATE });
        if (response && response.state) {
            latestState = response.state;
            updateUI(response.state);
        }
    } catch (_) {
        // Background may not be ready yet
    }

    // Update auth display
    await updateAuthDisplay();
}

init();
