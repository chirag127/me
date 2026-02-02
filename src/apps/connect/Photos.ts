// Photos
export default async function Photos(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Photos</h1><p class="page-subtitle">Pixelfed & Unsplash gallery</p></header><div class="glass-panel empty-state"><span class="empty-icon">📸</span><h3>Photo Gallery</h3><p>Unsplash API integration requires configuration.</p><a href="https://unsplash.com/@chirag127" target="_blank" class="btn btn-primary">View on Unsplash →</a></div></div><style>.empty-state{padding:var(--space-12);text-align:center}.empty-icon{font-size:var(--text-6xl);display:block;margin-bottom:var(--space-4)}.empty-state h3{margin-bottom:var(--space-2)}.empty-state p{color:var(--text-secondary);margin-bottom:var(--space-6)}</style>`;
}
