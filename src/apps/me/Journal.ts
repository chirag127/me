/**
 * Project Me - Journal Write Page
 * Admin: Google Sign-In → form to add entries
 * Visitors: view latest entries
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

      <!-- Add Entry Form (admin only) -->
      <div id="journal-form-wrapper" class="journal-form-wrapper" style="display:none;">
        <form id="journal-form" class="journal-form glass-panel">
          <h3 class="form-heading">New Entry</h3>

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

          <div class="form-actions">
            <span id="form-hint" class="form-hint">Fill at least one field</span>
            <button type="submit" class="btn btn-primary" id="j-submit">
              <span id="j-submit-text">Add Entry</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Success toast -->
      <div id="journal-toast" class="journal-toast"></div>

      <!-- Recent Entries -->
      <section class="journal-recent">
        <div class="section-header-row">
          <h3>Recent Entries</h3>
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
      .journal-auth { padding: var(--space-4) var(--space-6); display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); margin-bottom: var(--space-6); }
      .journal-auth .auth-info { display: flex; align-items: center; gap: var(--space-3); }
      .journal-auth .auth-email { font-size: var(--text-sm); color: var(--text-secondary); }
      .journal-auth .auth-badge { font-size: var(--text-xs); padding: 2px 8px; border-radius: 99px; background: var(--accent-green); color: #fff; font-weight: 600; }

      /* Form */
      .journal-form { padding: var(--space-6); margin-bottom: var(--space-6); }
      .form-heading { margin-bottom: var(--space-5); font-size: var(--text-xl); }
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
      .form-hint.error { color: var(--accent-red, #FF3B30); }
      .form-hint.success { color: var(--accent-green); }

      /* Toast */
      .journal-toast {
        position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(100px);
        padding: var(--space-3) var(--space-6); background: var(--accent-green); color: #fff;
        border-radius: var(--radius-lg); font-weight: 600; z-index: 999; opacity: 0;
        transition: all 0.3s ease;
      }
      .journal-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

      /* Recent entries */
      .journal-recent { margin-bottom: var(--space-6); }
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

  // --- INTERACTIVITY ---

  let selectedMood: number | null = null;

  // Auth state rendering
  const renderAuth = () => {
    const authEl = document.getElementById('journal-auth');
    const formWrapper = document.getElementById('journal-form-wrapper');
    if (!authEl) return;

    const user = getCurrentUser();
    const admin = isAdmin();

    if (admin && user) {
      authEl.innerHTML = `
        <div class="auth-info">
          <span class="auth-badge">Admin</span>
          <span class="auth-email">${user.email}</span>
        </div>
        <button class="btn btn-ghost" id="auth-signout">Sign Out</button>
      `;
      if (formWrapper) formWrapper.style.display = 'block';
      document.getElementById('auth-signout')?.addEventListener('click', () => signOutAdmin());
    } else if (user) {
      authEl.innerHTML = `
        <div class="auth-info">
          <span class="auth-email">${user.email}</span>
          <span style="font-size:var(--text-sm);color:var(--text-tertiary);">Read-only access</span>
        </div>
        <button class="btn btn-ghost" id="auth-signout">Sign Out</button>
      `;
      if (formWrapper) formWrapper.style.display = 'none';
      document.getElementById('auth-signout')?.addEventListener('click', () => signOutAdmin());
    } else {
      authEl.innerHTML = `
        <span style="font-size:var(--text-sm);color:var(--text-secondary);">Admin? Sign in to add entries</span>
        <button class="btn btn-primary" id="auth-signin">Sign In with Google</button>
      `;
      if (formWrapper) formWrapper.style.display = 'none';
      document.getElementById('auth-signin')?.addEventListener('click', () => signInAdmin());
    }
  };

  onJournalAuthChange(() => renderAuth());
  renderAuth();

  // Mood picker
  document.getElementById('mood-picker')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.mood-btn') as HTMLElement | null;
    if (!btn) return;
    const moodVal = parseInt(btn.dataset.mood || '', 10);

    // Toggle selection
    if (selectedMood === moodVal) {
      selectedMood = null;
      btn.classList.remove('active');
    } else {
      selectedMood = moodVal;
      document.querySelectorAll('.mood-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });

  // Form submit
  document.getElementById('journal-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hint = document.getElementById('form-hint');
    const submitBtn = document.getElementById('j-submit') as HTMLButtonElement;
    const submitText = document.getElementById('j-submit-text');

    const entry: Record<string, unknown> = {};
    const title = (document.getElementById('j-title') as HTMLInputElement).value.trim();
    const desc = (document.getElementById('j-desc') as HTMLTextAreaElement).value.trim();
    const willDo = (document.getElementById('j-willdo') as HTMLInputElement).value.trim();
    const doing = (document.getElementById('j-doing') as HTMLInputElement).value.trim();
    const done = (document.getElementById('j-done') as HTMLInputElement).value.trim();

    if (title) entry.t = title;
    if (desc) entry.d = desc;
    if (willDo) entry.w = willDo;
    if (doing) entry.g = doing;
    if (done) entry.h = done;
    if (selectedMood !== null) entry.m = selectedMood;

    // Validate
    if (Object.keys(entry).length === 0) {
      if (hint) {
        hint.textContent = 'At least one field must be filled!';
        hint.classList.add('error');
      }
      return;
    }

    // Submit
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Saving...';

    try {
      await addJournalEntry(entry);
      // Reset form
      (document.getElementById('journal-form') as HTMLFormElement)?.reset();
      selectedMood = null;
      document.querySelectorAll('.mood-btn').forEach((b) => b.classList.remove('active'));
      if (hint) {
        hint.textContent = 'Entry added!';
        hint.classList.remove('error');
        hint.classList.add('success');
      }
      showToast('✅ Journal entry added!');
      loadRecent();
    } catch (err) {
      if (hint) {
        hint.textContent = err instanceof Error ? err.message : 'Failed to add entry';
        hint.classList.add('error');
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Add Entry';
    }
  });

  // Load recent entries
  loadRecent();
}

async function loadRecent(): Promise<void> {
  const listEl = document.getElementById('journal-recent-list');
  if (!listEl) return;

  try {
    const page = await getJournalEntries(5);
    if (page.entries.length === 0) {
      listEl.innerHTML = '<div class="empty-state">No journal entries yet. Be the first to write!</div>';
      return;
    }
    listEl.innerHTML = page.entries.map((e) => renderEntryCard(e)).join('');
  } catch {
    listEl.innerHTML = '<div class="empty-state">Failed to load entries.</div>';
  }
}

function renderEntryCard(entry: JournalEntry): string {
  const date = entry.ts instanceof Timestamp ? entry.ts.toDate() : new Date(entry.ts);
  const dateStr = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
      </div>
    </article>
  `;
}

function showToast(message: string): void {
  const toast = document.getElementById('journal-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
