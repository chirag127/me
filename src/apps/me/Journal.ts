/**
 * Project Me - Journal Page
 * Personal blog/notes
 */

import { SOCIAL } from '../../data';

export default async function Journal(container: HTMLElement): Promise<void> {
  const entries = [
    {
      date: 'Feb 2026',
      title: 'Building My Digital Twin',
      excerpt: 'Why I decided to create an immersive portfolio that goes beyond a traditional resume...',
      tags: ['meta', 'portfolio'],
    },
    {
      date: 'Jan 2026',
      title: 'First Month at TCS',
      excerpt: 'Reflections on joining enterprise software development and the learning curve...',
      tags: ['career', 'reflection'],
    },
    {
      date: 'Dec 2025',
      title: 'My AI Development Journey',
      excerpt: 'How I went from curious about AI to building multi-agent RAG systems...',
      tags: ['ai', 'learning'],
    },
  ];

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Journal</h1>
        <p class="page-subtitle">Thoughts, learnings, and reflections</p>
      </header>

      <div class="journal-list">
        ${entries.map(entry => `
          <article class="journal-entry glass-panel">
            <time class="entry-date">${entry.date}</time>
            <h2 class="entry-title">${entry.title}</h2>
            <p class="entry-excerpt">${entry.excerpt}</p>
            <div class="entry-tags">
              ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </article>
        `).join('')}
      </div>

      <div class="journal-cta glass-panel">
        <h3>📝 More articles on Dev.to</h3>
        <p>I write about Python, AI, and system design.</p>
        <a href="${SOCIAL.devto.url}" target="_blank" class="btn btn-primary">Read on Dev.to →</a>
      </div>
    </div>

    <style>
      .journal-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        margin-bottom: var(--space-8);
      }

      .journal-entry {
        padding: var(--space-6);
        transition: transform var(--transition-fast);
      }

      .journal-entry:hover {
        transform: translateY(-4px);
      }

      .entry-date {
        font-size: var(--text-sm);
        color: var(--accent-blue);
        display: block;
        margin-bottom: var(--space-2);
      }

      .entry-title {
        font-size: var(--text-xl);
        margin-bottom: var(--space-3);
      }

      .entry-excerpt {
        color: var(--text-secondary);
        margin-bottom: var(--space-4);
      }

      .entry-tags {
        display: flex;
        gap: var(--space-2);
      }

      .journal-cta {
        padding: var(--space-6);
        text-align: center;
      }

      .journal-cta h3 {
        margin-bottom: var(--space-2);
      }

      .journal-cta p {
        color: var(--text-secondary);
        margin-bottom: var(--space-4);
      }
    </style>
  `;
}
