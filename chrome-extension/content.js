/**
 * LifeLogger - Content Script
 * Detects videos, password fields, and page content
 */

const SCROBBLE_THRESHOLD = 30; // seconds before logging video

let videoObservers = new Map();
let hasReportedPasswordField = false;

// Check for password fields immediately
checkPasswordFields();

// Observe for videos
observeVideos();

/**
 * Check for password input fields
 */
function checkPasswordFields() {
  const passwordFields = document.querySelectorAll('input[type="password"]');

  if (passwordFields.length > 0 && !hasReportedPasswordField) {
    hasReportedPasswordField = true;
    chrome.runtime.sendMessage({ action: 'hasPasswordField' });
    console.log('[LifeLogger] Password field detected - screenshots disabled');
  }
}

/**
 * Observe DOM for password fields
 */
const passwordObserver = new MutationObserver(() => {
  checkPasswordFields();
});

passwordObserver.observe(document.body, {
  childList: true,
  subtree: true
});

/**
 * Observe DOM for video elements
 */
function observeVideos() {
  // Track existing videos
  document.querySelectorAll('video').forEach(trackVideo);

  // Watch for new videos
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'VIDEO') {
          trackVideo(node);
        }
        if (node.querySelectorAll) {
          node.querySelectorAll('video').forEach(trackVideo);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Track video playback
 */
function trackVideo(video) {
  if (videoObservers.has(video)) return;

  let watchTime = 0;
  let hasLogged = false;

  const checkProgress = () => {
    if (video.paused || video.ended) return;

    watchTime++;

    // Log after threshold
    if (watchTime >= SCROBBLE_THRESHOLD && !hasLogged) {
      const metadata = extractVideoMetadata(video);

      chrome.runtime.sendMessage({
        action: 'videoDetected',
        data: metadata
      });

      hasLogged = true;
      console.log('[LifeLogger] Video logged:', metadata.title);
    }
  };

  const interval = setInterval(checkProgress, 1000);
  videoObservers.set(video, interval);

  // Cleanup on video removal
  video.addEventListener('ended', () => {
    clearInterval(interval);
    videoObservers.delete(video);
  });
}

/**
 * Extract video metadata
 */
function extractVideoMetadata(video) {
  let title = document.title;
  let platform = 'generic';

  // Try to get better title from page
  const h1 = document.querySelector('h1');
  if (h1) title = h1.textContent.trim();

  // Detect platform
  const hostname = window.location.hostname;
  if (hostname.includes('twitch')) platform = 'twitch';
  else if (hostname.includes('vimeo')) platform = 'vimeo';
  else if (hostname.includes('dailymotion')) platform = 'dailymotion';

  return {
    title,
    platform,
    duration: Math.round(video.duration) || 0,
    currentTime: Math.round(video.currentTime) || 0,
    url: window.location.href
  };
}

console.log('[LifeLogger] Content script loaded');
