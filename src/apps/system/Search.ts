// Search
export default async function Search(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Search</h1><p class="page-subtitle">Find anything across this site</p></header><div class="search-container glass-panel"><input type="text" id="search-input" class="search-input" placeholder="Search pages, skills, projects..." autofocus><div id="search-results" class="search-results"></div></div></div><style>.search-container{padding:var(--space-6)}.search-input{width:100%;padding:var(--space-4);font-size:var(--text-lg);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-lg);color:var(--text-primary);outline:none}.search-input:focus{border-color:var(--accent-blue)}.search-results{margin-top:var(--space-4)}.result-item{display:block;padding:var(--space-3);background:var(--glass-bg);border-radius:var(--radius-md);margin-bottom:var(--space-2);transition:all var(--transition-fast)}.result-item:hover{background:var(--glass-bg-hover);transform:translateX(4px)}.result-path{font-size:var(--text-xs);color:var(--text-tertiary)}</style>`;
  const input = document.getElementById('search-input') as HTMLInputElement;
  const results = document.getElementById('search-results')!;
  const pages = [
    { path: '#/me/index', title: 'Dashboard', keywords: 'home now status' },
    { path: '#/me/story', title: 'Story', keywords: 'timeline biography' },
    { path: '#/work/index', title: 'Work Summary', keywords: 'resume cv' },
    { path: '#/work/projects', title: 'Projects', keywords: 'github code' },
    { path: '#/work/skills', title: 'Skills', keywords: 'technologies stack' },
    { path: '#/code/stats', title: 'Coding Stats', keywords: 'wakatime github' },
    { path: '#/code/leetcode', title: 'LeetCode', keywords: 'dsa problems' },
    { path: '#/library/index', title: 'Media Library', keywords: 'music anime manga' },
    { path: '#/gaming/index', title: 'Gaming', keywords: 'chess steam' },
    { path: '#/connect/index', title: 'Connect', keywords: 'social contact' },
    { path: '#/system/ai', title: 'AI Chat', keywords: 'ask chirag puter' },
    { path: '#/system/settings', title: 'Settings', keywords: 'theme preferences' },
  ];
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    if (q.length < 2) { results.innerHTML = ''; return; }
    const matches = pages.filter(p => p.title.toLowerCase().includes(q) || p.keywords.includes(q));
    results.innerHTML = matches.map(p => `<a href="${p.path}" class="result-item"><strong>${p.title}</strong><span class="result-path">${p.path}</span></a>`).join('') || '<p class="muted">No results found</p>';
  });
}
