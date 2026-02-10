/**
 * @file Universal Video Detector - Content Script
 * Attaches to ALL <video> elements on ANY website using MutationObserver.
 * Extracts page metadata and sends play/pause/stop events to the background service worker.
 *
 * Injected on every page via manifest.json content_scripts with all_frames: true.
 */

(() => {
    'use strict';

    // ── Constants ───────────────────────────────────────────────
    const MIN_PLAY_SECONDS = 30;
    const PROGRESS_REPORT_INTERVAL_MS = 120000; // Report progress every 2 minutes
    const TRACKED_ATTR = 'data-omni-trakt-tracked';

    // ── State ───────────────────────────────────────────────────
    let activeVideoId = null;
    let playStartTime = null;
    let hasTriggeredStart = false;
    let progressIntervalId = null;
    let debounceTimerId = null;

    // ── Page Metadata Extraction ────────────────────────────────

    /**
     * Extract relevant metadata from the current page
     * @returns {Object} Page context for AI identification
     */
    function extractPageMetadata() {
        const getMeta = (attr, value) => {
            const el = document.querySelector(`meta[${attr}="${value}"]`);
            return el ? el.getAttribute('content') || '' : '';
        };

        return {
            url: window.location.href,
            title: document.title || '',
            ogTitle: getMeta('property', 'og:title'),
            description: getMeta('name', 'description') || getMeta('property', 'og:description'),
            heading: (document.querySelector('h1')?.textContent || '').trim(),
            h2: (document.querySelector('h2')?.textContent || '').trim(),
        };
    }

    // ── Messaging ───────────────────────────────────────────────

    /**
     * Send a message to the background service worker
     * @param {string} type - Message type
     * @param {Object} data - Message payload
     */
    function sendMessage(type, data = {}) {
        try {
            chrome.runtime.sendMessage({ type, ...data });
        } catch (err) {
            // Extension context may have been invalidated (e.g., extension reload)
            console.debug('[Omni-Trakt AI] Message send failed:', err.message);
        }
    }

    // ── Video Event Handlers ────────────────────────────────────

    /**
     * Handle video play event
     * @param {Event} event
     */
    function onVideoPlay(event) {
        const video = event.target;
        const videoId = video.getAttribute(TRACKED_ATTR);

        // If a different video starts, stop tracking the previous one
        if (activeVideoId && activeVideoId !== videoId) {
            handleVideoStop();
        }

        activeVideoId = videoId;
        playStartTime = Date.now();
        hasTriggeredStart = false;

        // Start the debounce timer — only trigger START after MIN_PLAY_SECONDS
        if (debounceTimerId) clearTimeout(debounceTimerId);
        debounceTimerId = setTimeout(() => {
            if (activeVideoId === videoId && !video.paused) {
                triggerVideoStart(video);
            }
        }, MIN_PLAY_SECONDS * 1000);
    }

    /**
     * Trigger the actual VIDEO_START after debounce period
     * @param {HTMLVideoElement} video
     */
    function triggerVideoStart(video) {
        hasTriggeredStart = true;
        const metadata = extractPageMetadata();
        const progress = calculateProgress(video);

        sendMessage('VIDEO_START', {
            pageContext: metadata,
            progress,
            videoDuration: video.duration || 0,
        });

        // Start periodic progress reporting
        startProgressReporting(video);
    }

    /**
     * Handle video pause event
     * @param {Event} event
     */
    function onVideoPause(event) {
        const video = event.target;
        const videoId = video.getAttribute(TRACKED_ATTR);

        if (activeVideoId !== videoId) return;

        // Cancel debounce if haven't triggered start yet
        if (!hasTriggeredStart) {
            if (debounceTimerId) clearTimeout(debounceTimerId);
            return;
        }

        const progress = calculateProgress(video);
        sendMessage('VIDEO_PAUSE', { progress });
        stopProgressReporting();
    }

    /**
     * Handle video ended event
     * @param {Event} event
     */
    function onVideoEnded(event) {
        const video = event.target;
        const videoId = video.getAttribute(TRACKED_ATTR);

        if (activeVideoId !== videoId) return;

        if (hasTriggeredStart) {
            sendMessage('VIDEO_STOP', { progress: 100 });
        }

        cleanup();
    }

    /**
     * Handle cleanup when video stops or is removed
     */
    function handleVideoStop() {
        if (hasTriggeredStart) {
            sendMessage('VIDEO_STOP', { progress: 0 });
        }
        cleanup();
    }

    /**
     * Reset tracking state
     */
    function cleanup() {
        if (debounceTimerId) clearTimeout(debounceTimerId);
        stopProgressReporting();
        activeVideoId = null;
        playStartTime = null;
        hasTriggeredStart = false;
        debounceTimerId = null;
    }

    // ── Progress Reporting ──────────────────────────────────────

    /**
     * Start periodic progress updates to background worker
     * @param {HTMLVideoElement} video
     */
    function startProgressReporting(video) {
        stopProgressReporting();
        progressIntervalId = setInterval(() => {
            if (!video || video.paused || video.ended) {
                stopProgressReporting();
                return;
            }
            const progress = calculateProgress(video);
            sendMessage('VIDEO_PROGRESS', { progress });
        }, PROGRESS_REPORT_INTERVAL_MS);
    }

    /**
     * Stop periodic progress reporting
     */
    function stopProgressReporting() {
        if (progressIntervalId) {
            clearInterval(progressIntervalId);
            progressIntervalId = null;
        }
    }

    /**
     * Calculate playback progress percentage
     * @param {HTMLVideoElement} video
     * @returns {number} Progress 0-100
     */
    function calculateProgress(video) {
        if (!video || !video.duration || !isFinite(video.duration)) return 0;
        return Math.round((video.currentTime / video.duration) * 100);
    }

    // ── Video Tracking ──────────────────────────────────────────

    /**
     * Attach event listeners to a video element
     * @param {HTMLVideoElement} video
     */
    function trackVideo(video) {
        if (video.hasAttribute(TRACKED_ATTR)) return;

        // Generate a unique ID for this video element
        const videoId = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        video.setAttribute(TRACKED_ATTR, videoId);

        video.addEventListener('play', onVideoPlay);
        video.addEventListener('pause', onVideoPause);
        video.addEventListener('ended', onVideoEnded);

        console.debug(`[Omni-Trakt AI] Tracking video: ${videoId}`);
    }

    /**
     * Scan the DOM for all existing video elements and track them
     */
    function scanForVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(trackVideo);
    }

    // ── MutationObserver ────────────────────────────────────────
    // Watches for dynamically added video elements (SPAs, lazy-loading, iframes)

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                // Direct video element added
                if (node.tagName === 'VIDEO') {
                    trackVideo(node);
                }

                // Video element nested inside added subtree
                if (node.querySelectorAll) {
                    node.querySelectorAll('video').forEach(trackVideo);
                }
            }

            // Also check for removed nodes to clean up
            for (const node of mutation.removedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                if (node.tagName === 'VIDEO' && node.getAttribute(TRACKED_ATTR) === activeVideoId) {
                    handleVideoStop();
                }

                if (node.querySelectorAll) {
                    node.querySelectorAll(`video[${TRACKED_ATTR}="${activeVideoId}"]`).forEach(() => {
                        handleVideoStop();
                    });
                }
            }
        }
    });

    // ── Initialize ──────────────────────────────────────────────

    // Scan for existing videos
    scanForVideos();

    // Start observing the DOM for new videos
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    console.debug('[Omni-Trakt AI] Content script initialized — watching for videos.');
})();
