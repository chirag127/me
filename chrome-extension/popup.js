/**
 * LifeLogger - Popup Script
 */

// DOM elements
const authSection = document.getElementById('auth-section');
const statsSection = document.getElementById('stats-section');
const status = document.getElementById('status');
const signInBtn = document.getElementById('sign-in-btn');
const signOutBtn = document.getElementById('sign-out-btn');

// Stat elements
const statPages = document.getElementById('stat-pages');
const statSearches = document.getElementById('stat-searches');
const statVideos = document.getElementById('stat-videos');
const statScreenshots = document.getElementById('stat-screenshots');

// User elements
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const syncStatus = document.getElementById('sync-status');

// Initialize
init();

async function init() {
  const statusData = await chrome.runtime.sendMessage({ action: 'getStatus' });

  if (statusData.authenticated) {
    showAuthenticatedUI(statusData);
  } else {
    showUnauthenticatedUI();
  }

  loadStats();
}

/**
 * Show authenticated UI
 */
function showAuthenticatedUI(data) {
  authSection.style.display = 'none';
  statsSection.style.display = 'block';

  // Update status
  status.classList.add('online');
  status.querySelector('.status-text').textContent = 'Syncing';

  // Update user info
  if (data.user) {
    userAvatar.src = data.user.picture || '';
    userName.textContent = data.user.name || 'User';
    userEmail.textContent = data.user.email || '';
  }

  // Update sync status
  if (data.queueLength > 0) {
    syncStatus.classList.add('pending');
    syncStatus.innerHTML = `<span class="sync-icon">⏳</span><span>${data.queueLength} pending</span>`;
  }
}

/**
 * Show unauthenticated UI
 */
function showUnauthenticatedUI() {
  authSection.style.display = 'flex';
  statsSection.style.display = 'none';

  status.classList.remove('online');
  status.querySelector('.status-text').textContent = 'Offline';
}

/**
 * Load and display stats
 */
async function loadStats() {
  const stats = await chrome.runtime.sendMessage({ action: 'getStats' });

  if (statPages) statPages.textContent = stats.browsed || 0;
  if (statSearches) statSearches.textContent = stats.searches || 0;
  if (statVideos) statVideos.textContent = stats.videos || 0;
  if (statScreenshots) statScreenshots.textContent = stats.screenshots || 0;
}

/**
 * Sign in handler
 */
signInBtn?.addEventListener('click', async () => {
  signInBtn.disabled = true;
  signInBtn.textContent = 'Signing in...';

  const result = await chrome.runtime.sendMessage({ action: 'signIn' });

  if (result.success) {
    location.reload();
  } else {
    signInBtn.disabled = false;
    signInBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign in with Google
    `;
    alert('Sign in failed: ' + (result.error || 'Unknown error'));
  }
});

/**
 * Sign out handler
 */
signOutBtn?.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ action: 'signOut' });
  location.reload();
});
