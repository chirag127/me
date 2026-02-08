/**
 * LifeLogger - Background Service Worker
 * Handles page tracking, auth, and API calls
 */

import { auth } from './auth.js';
import { screenshot } from './screenshot.js';
import CONFIG from './config.js';

// Data queues
let browseQueue = [];
let searchQueue = [];
let videoQueue = [];

// Initialize
init();

async function init() {
  // Restore auth session
  await auth.restoreSession();

  // Listen for navigation events
  chrome.webNavigation.onCompleted.addListener(handlePageLoad);

  // Sync queued data periodically
  setInterval(syncQueues, 30000);

  // Update badge
  updateBadge();

  console.log('[LifeLogger] Background worker initialized');
}

/**
 * Handle page load - log browse history
 */
async function handlePageLoad(details) {
  // Only main frame
  if (details.frameId !== 0) return;

  const tab = await chrome.tabs.get(details.tabId);
  if (!tab.url || tab.url.startsWith('chrome://')) return;

  const url = tab.url;
  const title = tab.title || '';

  // Create browse log entry
  const entry = {
    id: Date.now().toString(),
    url,
    title,
    timestamp: new Date().toISOString(),
    type: 'browse'
  };

  // Check if it's a search page
  const searchData = extractSearchQuery(url);
  if (searchData) {
    entry.type = 'search';
    entry.query = searchData.query;
    entry.engine = searchData.engine;

    // Screenshot search pages (after delay)
    setTimeout(async () => {
      if (await shouldCaptureScreenshot(url)) {
        entry.screenshot_url = await screenshot.captureAndUpload(details.tabId, url);
      }
    }, CONFIG.SCREENSHOT_DELAY_MS);
  }

  // Queue the entry
  browseQueue.push(entry);

  // If authenticated, sync immediately
  if (auth.isAuthorized()) {
    await syncEntry(entry);
  }

  updateBadge();
}

/**
 * Extract search query from URL
 */
function extractSearchQuery(url) {
  try {
    const urlObj = new URL(url);

    for (const engine of CONFIG.SEARCH_ENGINES) {
      if (engine.pattern.test(url)) {
        const query = urlObj.searchParams.get(engine.param);
        if (query) {
          return { engine: engine.name, query };
        }
      }
    }
  } catch (e) {}

  return null;
}

/**
 * Check if should capture screenshot
 */
async function shouldCaptureScreenshot(url) {
  // Only search and video pages
  const isSearch = CONFIG.SEARCH_ENGINES.some(e => e.pattern.test(url));
  const isVideo = await isVideoPage(url);

  return isSearch || isVideo;
}

/**
 * Check if URL is a video page (non-music)
 */
function isVideoPage(url) {
  // Skip platforms handled by other scrobblers
  for (const platform of CONFIG.SKIP_PLATFORMS) {
    if (url.includes(platform)) return false;
  }

  // Generic video detection happens in content script
  return false;
}

/**
 * Sync single entry to API
 */
async function syncEntry(entry) {
  if (!CONFIG.API_BASE_URL) return;

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}?action=add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.getToken()}`
      },
      body: JSON.stringify(entry)
    });

    if (response.ok) {
      // Remove from queue
      browseQueue = browseQueue.filter(e => e.id !== entry.id);
    }
  } catch (error) {
    console.error('[LifeLogger] Sync failed:', error);
  }
}

/**
 * Sync all queued data
 */
async function syncQueues() {
  if (!auth.isAuthorized()) return;
  if (browseQueue.length === 0) return;

  console.log('[LifeLogger] Syncing', browseQueue.length, 'entries');

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}?action=bulkAdd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.getToken()}`
      },
      body: JSON.stringify({ entries: browseQueue })
    });

    if (response.ok) {
      browseQueue = [];
    }
  } catch (error) {
    console.error('[LifeLogger] Bulk sync failed:', error);
  }

  updateBadge();
}

/**
 * Update extension badge
 */
function updateBadge() {
  const count = browseQueue.length;
  chrome.action.setBadgeText({ text: count > 0 ? count.toString() : '' });
  chrome.action.setBadgeBackgroundColor({
    color: auth.isAuthenticated() ? '#22c55e' : '#6366f1'
  });
}

/**
 * Handle messages from content script and popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse);
  return true; // Keep channel open for async
});

async function handleMessage(message, sender) {
  switch (message.action) {
    case 'signIn':
      return auth.signIn();

    case 'signOut':
      return auth.signOut();

    case 'getStatus':
      return {
        authenticated: auth.isAuthenticated(),
        authorized: auth.isAuthorized(),
        user: auth.getUser(),
        queueLength: browseQueue.length
      };

    case 'getStats':
      return getLocalStats();

    case 'videoDetected':
      return handleVideoDetected(message.data, sender.tab);

    case 'hasPasswordField':
      // Content script reports password field - skip screenshot
      return { skipScreenshot: true };

    default:
      return { error: 'Unknown action' };
  }
}

/**
 * Handle video detection from content script
 */
async function handleVideoDetected(data, tab) {
  // Skip platforms handled by other scrobblers
  if (CONFIG.SKIP_PLATFORMS.some(p => tab.url.includes(p))) {
    return { skipped: true, reason: 'handled_by_other_scrobbler' };
  }

  const entry = {
    id: Date.now().toString(),
    url: tab.url,
    title: data.title || tab.title,
    timestamp: new Date().toISOString(),
    type: 'video',
    platform: data.platform || 'generic',
    duration: data.duration || 0
  };

  // Screenshot video pages
  if (await shouldCaptureScreenshot(tab.url)) {
    entry.screenshot_url = await screenshot.captureAndUpload(tab.id, tab.url);
  }

  videoQueue.push(entry);

  if (auth.isAuthorized()) {
    await syncEntry(entry);
  }

  return { success: true };
}

/**
 * Get local statistics
 */
async function getLocalStats() {
  const stored = await chrome.storage.local.get(['stats']);

  return {
    browsed: browseQueue.filter(e => e.type === 'browse').length,
    searches: browseQueue.filter(e => e.type === 'search').length,
    videos: videoQueue.length,
    ...stored.stats
  };
}
