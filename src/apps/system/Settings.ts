// Settings
import { store, type Theme } from '../../data/store';
import { SOCIAL } from '../../data';

export default async function Settings(c: HTMLElement): Promise<void> {
  const currentTheme = store.theme.get();
  const sourceCodeUrl = `${SOCIAL.github.url}/me`;

  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Settings</h1><p class="page-subtitle">Customize your experience</p></header><section class="settings-section glass-panel"><h3>🎨 Appearance</h3><div class="setting-row"><span>Theme</span><div class="theme-buttons"><button class="theme-btn ${currentTheme === 'light' ? 'active' : ''}" data-theme="light">☀️ Light</button><button class="theme-btn ${currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">🌙 Dark</button><button class="theme-btn ${currentTheme === 'auto' ? 'active' : ''}" data-theme="auto">💻 Auto</button></div></div></section><section class="settings-section glass-panel"><h3>📊 Stats</h3><div class="setting-row"><span>Visit Count</span><span id="visit-count">${store.visitCount.get()}</span></div></section><section class="settings-section glass-panel"><h3>🔗 Quick Links</h3><div class="quick-links"><a href="${sourceCodeUrl}" target="_blank" class="btn btn-secondary">Source Code</a><a href="#/code/json" class="btn btn-secondary">Resume JSON</a></div></section></div><style>.settings-section{padding:var(--space-6);margin-bottom:var(--space-4)}.settings-section h3{margin-bottom:var(--space-4)}.setting-row{display:flex;justify-content:space-between;align-items:center;padding:var(--space-3) 0;border-bottom:1px solid var(--glass-border)}.setting-row:last-child{border-bottom:none}.theme-buttons{display:flex;gap:var(--space-2)}.theme-btn{padding:var(--space-2) var(--space-3);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-md);cursor:pointer;transition:all var(--transition-fast)}.theme-btn:hover{border-color:var(--accent-blue)}.theme-btn.active{background:var(--accent-blue);color:white;border-color:var(--accent-blue)}.quick-links{display:flex;gap:var(--space-3)}</style>`;

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = (btn as HTMLElement).dataset.theme as Theme;
      store.theme.set(theme);
      document.documentElement.dataset.theme = theme === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}
