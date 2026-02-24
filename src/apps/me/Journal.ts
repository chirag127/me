/**
 * Project Me - Journal Write Page
 * Inline form (no modal) with dual auth (Google/Puter.js)
 * Admin (whyiswhen@gmail.com) → Firestore
 * Non-admin (Puter.js) → Puter.js KV storage
 * Form clears + success banner on save
 */

import {
  MOOD_MAP,
  FIELD_LABELS,
  isAdmin,
  getCurrentUser,
  signInAdmin,
  signOutAdmin,
  onJournalAuthChange,
  addJournalEntry,
  getJournalEntries,
  isPuterAvailable,
  isPuterSignedIn,
  signInPuter,
  signOutPuter,
  getPuterUser,
  addPuterJournalEntry,
  getPuterJournalEntries,
  type JournalEntry,
} from '../../services/journal';
import { Timestamp } from 'firebase/firestore';

export default async function Journal(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">✍️ Journal</h1>
        <p class="page-subtitle">Daily thoughts, moods, and reflections</p>
      </header>

      <!-- Auth Banner -->
      <div id="journal-auth" class="journal-auth glass-panel"></div>

      <!-- Success Banner (hidden by default) -->
      <div id="success-banner" class="success-banner" style="display:none;">
        <span class="success-icon">🎉</span>
        <span id="success-text">Entry saved successfully!</span>
        <button class="success-close" id="success-close" title="Dismiss">✕</button>
      </div>

      <!-- Inline Form (visible when signed in) -->
      <section id="journal-form-section" class="journal-section" style="display:none;">
        <form id="journal-form" class="journal-form glass-panel">
          <h3 class="form-heading">📝 Add New Entry</h3>
          <div class="form-field">
            <label for="j-title">${FIELD_LABELS.t}</label>
            <input type="text" id="j-title" placeholder="What's on your mind?" maxlength="200" autocomplete="off">
          </div>
          <div class="form-field">
            <label for="j-desc">${FIELD_LABELS.d}</label>
            <textarea id="j-desc" rows="3" placeholder="Elaborate..." maxlength="2000"></textarea>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label for="j-willdo">${FIELD_LABELS.w}</label>
              <input type="text" id="j-willdo" placeholder="Plans..." maxlength="500">
            </div>
            <div class="form-field">
              <label for="j-doing">${FIELD_LABELS.g}</label>
              <input type="text" id="j-doing" placeholder="Currently..." maxlength="500">
            </div>
          </div>
          <div class="form-field">
            <label for="j-done">${FIELD_LABELS.h}</label>
            <input type="text" id="j-done" placeholder="Accomplished..." maxlength="500">
          </div>
          <div class="form-field">
            <label>Mood</label>
            <div class="mood-picker" id="mood-picker">
              ${Object.entries(MOOD_MAP).map(([val, { emoji, label }]) => `
                <button type="button" class="mood-btn" data-mood="${val}" title="${label}">
                  <span class="mood-emoji">${emoji}</span>
                  <span class="mood-label">${label}</span>
                </button>
              `).join('')}
            </div>
          </div>
          <div class="form-field">
            <span id="storage-label" class="storage-indicator"></span>
          </div>
          <div class="form-actions">
            <span id="form-error" class="form-hint"></span>
            <button type="submit" class="btn btn-primary" id="j-submit">
              <span id="j-submit-text">Add Entry</span>
            </button>
          </div>
        </form>
      </section>

      <!-- Puter.js My Entries -->
      <section id="puter-entries-section" class="journal-section" style="display:none;">
        <div class="section-header-row">
          <h3>🔒 My Entries <span class="badge-puter">Puter.js</span></h3>
        </div>
        <div id="puter-entries-list" class="journal-list"></div>
      </section>

      <!-- Public Entries (Firestore) -->
      <section class="journal-section">
        <div class="section-header-row">
          <h3>📰 Public Entries</h3>
          <a href="#/me/journal-feed" class="btn btn-ghost">View All →</a>
        </div>
        <div id="journal-recent-list" class="journal-list">
          <div class="loading-container"><div class="loading-spinner"></div><p>Loading...</p></div>
        </div>
      </section>

      <!-- Nav cards -->
      <div class="journal-nav-cards">
        <a href="#/me/journal-feed" class="journal-nav-card glass-panel">
          <span class="nav-card-icon">📰</span>
          <span class="nav-card-title">Feed</span>
          <span class="nav-card-desc">Browse all entries & heatmap</span>
        </a>
        <a href="#/me/journal-charts" class="journal-nav-card glass-panel">
          <span class="nav-card-icon">📊</span>
          <span class="nav-card-title">Analytics</span>
          <span class="nav-card-desc">Charts, streaks & mood trends</span>
        </a>
      </div>
    </div>

    <style>
      /* Auth */
      .journal-auth { padding: var(--space-4) var(--space-6); display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); margin-bottom: var(--space-5); flex-wrap: wrap; }
      .auth-info { display: flex; align-items: center; gap: var(--space-3); }
      .auth-email { font-size: var(--text-sm); color: var(--text-secondary); }
      .auth-badge { font-size: var(--text-xs); padding: 2px 8px; border-radius: 99px; font-weight: 600; }
      .badge-admin { background: var(--accent-green); color: #fff; }
      .badge-puter { background: #6366F1; color: #fff; font-size: var(--text-xs); padding: 2px 8px; border-radius: 99px; font-weight: 600; }
      .auth-buttons { display: flex; gap: var(--space-2); flex-wrap: wrap; }
      .auth-separator { font-size: var(--text-sm); color: var(--text-tertiary); }

      /* Success Banner */
      .success-banner {
        padding: var(--space-4) var(--space-6); margin-bottom: var(--space-5);
        background: linear-gradient(135deg, rgba(52,199,89,0.15), rgba(52,199,89,0.08));
        border: 2px solid rgba(52,199,89,0.4);
        border-radius: var(--radius-lg);
        display: flex; align-items: center; gap: var(--space-3);
        animation: successSlideIn 0.4s ease forwards;
      }
      .success-banner .success-icon { font-size: 1.5rem; }
      .success-banner #success-text { flex: 1; font-weight: 600; color: var(--accent-green); font-size: var(--text-base); }
      .success-close {
        width: 28px; height: 28px; border-radius: 50%; border: none;
        background: rgba(52,199,89,0.2); color: var(--accent-green);
        cursor: pointer; font-size: 0.9rem;
        display: flex; align-items: center; justify-content: center;
      }
      .success-close:hover { background: rgba(52,199,89,0.3); }
      @keyframes successSlideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

      /* Form */
      .journal-form { padding: var(--space-6); }
      .form-heading { margin: 0 0 var(--space-5) 0; font-size: var(--text-lg); }
      .form-field { margin-bottom: var(--space-4); }
      .form-field label { display: block; font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-1); font-weight: 500; }
      .form-field input, .form-field textarea {
        width: 100%; padding: var(--space-3); background: var(--glass-bg); border: 1px solid var(--glass-border);
        border-radius: var(--radius-md); color: var(--text-primary); font-size: var(--text-base);
        font-family: inherit; transition: border-color var(--transition-fast);
      }
      .form-field input:focus, .form-field textarea:focus { outline: none; border-color: var(--accent-blue); }
      .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
      @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

      /* Storage indicator */
      .storage-indicator { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-xs); color: var(--text-tertiary); }

      /* Mood picker */
      .mood-picker { display: flex; flex-wrap: wrap; gap: var(--space-2); }
      .mood-btn {
        display: flex; flex-direction: column; align-items: center; gap: 4px;
        padding: var(--space-2) var(--space-3); border-radius: var(--radius-md);
        background: var(--glass-bg); border: 2px solid transparent; cursor: pointer;
        transition: all var(--transition-fast); color: var(--text-primary);
      }
      .mood-btn:hover { background: var(--glass-border); transform: translateY(-2px); }
      .mood-btn.active { border-color: var(--accent-blue); background: rgba(0,122,255,0.15); }
      .mood-emoji { font-size: 1.5rem; }
      .mood-label { font-size: var(--text-xs); color: var(--text-secondary); }

      /* Actions */
      .form-actions { display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-4); }
      .form-hint { font-size: var(--text-sm); color: var(--text-tertiary); }
      .form-hint.error { color: var(--accent-red, #FF3B30); font-weight: 500; }

      /* Sections */
      .journal-section { margin-bottom: var(--space-6); }
      .section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); }
      .journal-list { display: flex; flex-direction: column; gap: var(--space-3); }

      .journal-entry-card {
        padding: var(--space-4) var(--space-5); background: var(--glass-bg);
        border-radius: var(--radius-lg); border: 1px solid var(--glass-border);
        transition: transform var(--transition-fast);
      }
      .journal-entry-card:hover { transform: translateY(-2px); }
      .entry-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2); }
      .entry-card-date { font-size: var(--text-xs); color: var(--text-tertiary); }
      .entry-card-mood { font-size: 1.2rem; }
      .entry-card-title { font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-1); }
      .entry-card-text { font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.5; }
      .entry-card-tags { display: flex; gap: var(--space-2); margin-top: var(--space-2); flex-wrap: wrap; }
      .entry-card-tag { font-size: var(--text-xs); padding: 2px 8px; border-radius: 99px; background: rgba(0,122,255,0.1); color: var(--accent-blue); }
      .entry-card-tag.puter-tag { background: rgba(99,102,241,0.15); color: #6366F1; }

      /* Nav cards */
      .journal-nav-cards { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
      @media (max-width: 600px) { .journal-nav-cards { grid-template-columns: 1fr; } }
      .journal-nav-card {
        padding: var(--space-5); text-decoration: none; color: var(--text-primary);
        display: flex; flex-direction: column; gap: var(--space-1);
        transition: transform var(--transition-fast);
      }
      .journal-nav-card:hover { transform: translateY(-3px); }
      .nav-card-icon { font-size: 2rem; }
      .nav-card-title { font-size: var(--text-lg); font-weight: 600; }
      .nav-card-desc { font-size: var(--text-sm); color: var(--text-secondary); }
      .empty-state { text-align: center; padding: var(--space-8); color: var(--text-tertiary); }
    </style>
  `;

  // --- STATE ---
  let selectedMood: number | null = null;
  let puterUser: { username: string; email?: string } | null = null;

  // --- AUTH RENDERING ---
  const renderAuth = async () => {
    const authEl = document.getElementById('journal-auth');
    const formSection = document.getElementById('journal-form-section');
    const storageLabel = document.getElementById('storage-label');
    if (!authEl) return;

    const firebaseUser = getCurrentUser();
    const admin = isAdmin();
    const puterSignedIn = isPuterSignedIn();

    if (puterSignedIn) {
      puterUser = await getPuterUser();
    }

    const canWrite = admin || puterSignedIn;

    // Show/hide form section
    if (formSection) formSection.style.display = canWrite ? 'block' : 'none';

    // Storage label
    if (storageLabel) {
      if (admin) {
        storageLabel.innerHTML = '🔥 Saving to <strong>Firebase Firestore</strong> (public)';
      } else if (puterSignedIn) {
        storageLabel.innerHTML = '🔒 Saving to <strong>Puter.js KV</strong> (private, your account)';
      }
    }

    // Render auth banner
    if (admin && firebaseUser) {
      authEl.innerHTML = `
              <div class="auth-info">
                <span class="auth-badge badge-admin">Admin</span>
                <span class="auth-email">${firebaseUser.email}</span>
              </div>
              <button class="btn btn-ghost" id="auth-signout-google">Sign Out</button>
            `;
      document.getElementById('auth-signout-google')?.addEventListener('click', () => signOutAdmin());
    } else if (firebaseUser) {
      authEl.innerHTML = `
              <div class="auth-info">
                <span class="auth-email">${firebaseUser.email}</span>
                <span style="font-size:var(--text-xs);color:var(--text-tertiary);">Not admin — use Puter.js to save privately</span>
              </div>
              <div class="auth-buttons">
                ${!puterSignedIn ? `<button class="btn btn-secondary" id="auth-signin-puter" style="background:#6366F1;color:#fff;">Sign In with Puter.js</button>` : ''}
                <button class="btn btn-ghost" id="auth-signout-google">Sign Out Google</button>
              </div>
            `;
      document.getElementById('auth-signout-google')?.addEventListener('click', () => signOutAdmin());
      document.getElementById('auth-signin-puter')?.addEventListener('click', async () => { await signInPuter(); renderAuth(); loadPuterEntries(); });
    } else if (puterSignedIn && puterUser) {
      authEl.innerHTML = `
              <div class="auth-info">
                <span class="auth-badge badge-puter">Puter.js</span>
                <span class="auth-email">${puterUser.username}</span>
              </div>
              <div class="auth-buttons">
                <button class="btn btn-ghost" id="auth-signout-puter">Sign Out Puter.js</button>
                <span class="auth-separator">|</span>
                <button class="btn btn-ghost" id="auth-signin-google">Admin? Sign In with Google</button>
              </div>
            `;
      document.getElementById('auth-signout-puter')?.addEventListener('click', async () => { await signOutPuter(); puterUser = null; renderAuth(); });
      document.getElementById('auth-signin-google')?.addEventListener('click', () => signInAdmin());
    } else {
      authEl.innerHTML = `
              <span style="font-size:var(--text-sm);color:var(--text-secondary);">Sign in to add journal entries</span>
              <div class="auth-buttons">
                <button class="btn btn-primary" id="auth-signin-google">Google (Admin)</button>
                ${isPuterAvailable() ? `<button class="btn btn-secondary" id="auth-signin-puter" style="background:#6366F1;color:#fff;">Puter.js</button>` : ''}
              </div>
            `;
      document.getElementById('auth-signin-google')?.addEventListener('click', () => signInAdmin());
      document.getElementById('auth-signin-puter')?.addEventListener('click', async () => { await signInPuter(); renderAuth(); loadPuterEntries(); });
    }

    if (puterSignedIn) {
      loadPuterEntries();
    } else {
      const puterSection = document.getElementById('puter-entries-section');
      if (puterSection) puterSection.style.display = 'none';
    }
  };

  onJournalAuthChange(() => renderAuth());
  renderAuth();

  // --- MOOD PICKER ---
  document.getElementById('mood-picker')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.mood-btn') as HTMLElement | null;
    if (!btn) return;
    const moodVal = parseInt(btn.dataset.mood || '', 10);
    if (selectedMood === moodVal) {
      selectedMood = null;
      btn.classList.remove('active');
    } else {
      selectedMood = moodVal;
      document.querySelectorAll('.mood-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });

  // --- SUCCESS BANNER ---
  document.getElementById('success-close')?.addEventListener('click', () => {
    const banner = document.getElementById('success-banner');
    if (banner) banner.style.display = 'none';
  });

  const showSuccess = (message: string) => {
    const banner = document.getElementById('success-banner');
    const text = document.getElementById('success-text');
    if (banner && text) {
      text.textContent = message;
      banner.style.display = 'flex';
      banner.style.animation = 'none';
      // Trigger reflow to replay animation
      void banner.offsetWidth;
      banner.style.animation = 'successSlideIn 0.4s ease forwards';
      // Auto-hide after 5 seconds
      setTimeout(() => { banner.style.display = 'none'; }, 5000);
    }
  };

  // --- FORM SUBMIT ---
  document.getElementById('journal-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('form-error');
    const submitBtn = document.getElementById('j-submit') as HTMLButtonElement;
    const submitText = document.getElementById('j-submit-text');

    const titleInput = document.getElementById('j-title') as HTMLInputElement;
    const descInput = document.getElementById('j-desc') as HTMLTextAreaElement;
    const willDoInput = document.getElementById('j-willdo') as HTMLInputElement;
    const doingInput = document.getElementById('j-doing') as HTMLInputElement;
    const doneInput = document.getElementById('j-done') as HTMLInputElement;

    const entry: Record<string, unknown> = {};
    if (titleInput.value.trim()) entry.t = titleInput.value.trim();
    if (descInput.value.trim()) entry.d = descInput.value.trim();
    if (willDoInput.value.trim()) entry.w = willDoInput.value.trim();
    if (doingInput.value.trim()) entry.g = doingInput.value.trim();
    if (doneInput.value.trim()) entry.h = doneInput.value.trim();
    if (selectedMood !== null) entry.m = selectedMood;

    if (Object.keys(entry).length === 0) {
      if (errorEl) { errorEl.textContent = 'At least one field must be filled!'; errorEl.classList.add('error'); }
      return;
    }

    // Clear any previous error
    if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('error'); }

    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Saving...';

    try {
      if (isAdmin()) {
        await addJournalEntry(entry);
        showSuccess('🔥 Entry saved to Firestore successfully!');
      } else if (isPuterSignedIn()) {
        await addPuterJournalEntry(entry);
        showSuccess('🔒 Entry saved to Puter.js successfully!');
      } else {
        throw new Error('Please sign in first.');
      }

      // CLEAR the form fields
      titleInput.value = '';
      descInput.value = '';
      willDoInput.value = '';
      doingInput.value = '';
      doneInput.value = '';
      selectedMood = null;
      document.querySelectorAll('.mood-btn').forEach((b) => b.classList.remove('active'));

      // Reload entries below
      loadRecent();
      if (isPuterSignedIn()) loadPuterEntries();
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err instanceof Error ? err.message : 'Failed to save';
        errorEl.classList.add('error');
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Add Entry';
    }
  });

  // --- LOAD ENTRIES ---
  loadRecent();
}

async function loadRecent(): Promise<void> {
  const listEl = document.getElementById('journal-recent-list');
  if (!listEl) return;
  try {
    const page = await getJournalEntries(5);
    if (page.entries.length === 0) {
      listEl.innerHTML = '<div class="empty-state">No public journal entries yet.</div>';
      return;
    }
    listEl.innerHTML = page.entries.map((e) => renderEntryCard(e, 'firestore')).join('');
  } catch {
    listEl.innerHTML = '<div class="empty-state">Failed to load entries.</div>';
  }
}

async function loadPuterEntries(): Promise<void> {
  const section = document.getElementById('puter-entries-section');
  const listEl = document.getElementById('puter-entries-list');
  if (!section || !listEl) return;

  if (!isPuterSignedIn()) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  const entries = await getPuterJournalEntries();

  if (entries.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No private entries yet. Add your first one!</div>';
    return;
  }

  listEl.innerHTML = entries.map((e) => renderEntryCard(e, 'puter')).join('');
}

function renderEntryCard(entry: JournalEntry, source: 'firestore' | 'puter'): string {
  let date: Date;
  if (entry.ts instanceof Timestamp) {
    date = entry.ts.toDate();
  } else if (typeof entry.ts === 'string') {
    date = new Date(entry.ts);
  } else if (entry.ts && typeof entry.ts === 'object' && 'seconds' in entry.ts) {
    date = new Date((entry.ts as { seconds: number }).seconds * 1000);
  } else {
    date = new Date();
  }

  const dateStr = date.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const moodInfo = entry.m !== undefined && entry.m !== null ? MOOD_MAP[entry.m] : null;

  const textParts: string[] = [];
  if (entry.w) textParts.push(`<strong>Will do:</strong> ${entry.w}`);
  if (entry.g) textParts.push(`<strong>Doing:</strong> ${entry.g}`);
  if (entry.h) textParts.push(`<strong>Done:</strong> ${entry.h}`);
  if (entry.d) textParts.push(entry.d);

  return `
    <article class="journal-entry-card">
      <div class="entry-card-header">
        <time class="entry-card-date">${dateStr}</time>
        ${moodInfo ? `<span class="entry-card-mood" title="${moodInfo.label}">${moodInfo.emoji}</span>` : ''}
      </div>
      ${entry.t ? `<div class="entry-card-title">${entry.t}</div>` : ''}
      ${textParts.length > 0 ? `<div class="entry-card-text">${textParts.join(' · ')}</div>` : ''}
      <div class="entry-card-tags">
        ${entry.w ? '<span class="entry-card-tag">📋 Plan</span>' : ''}
        ${entry.g ? '<span class="entry-card-tag">⚡ Active</span>' : ''}
        ${entry.h ? '<span class="entry-card-tag">✅ Done</span>' : ''}
        ${source === 'puter' ? '<span class="entry-card-tag puter-tag">🔒 Private</span>' : ''}
      </div>
    </article>
  `;
}
