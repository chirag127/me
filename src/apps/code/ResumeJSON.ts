/**
 * Project Me - Resume JSON Page
 */

import { RESUME } from '../../data/resume';

export default async function ResumeJSON(container: HTMLElement): Promise<void> {
  const jsonResume = JSON.stringify(RESUME, null, 2);

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Structured Resume Data</h1>
        <p class="page-subtitle">Machine-readable JSON Resume — compatible with ATS and HR systems</p>
      </header>

      <div class="json-actions">
        <button class="btn btn-primary" id="copy-json">📋 Copy JSON</button>
        <button class="btn btn-secondary" id="download-json">⬇️ Download</button>
      </div>

      <div class="json-container glass-panel">
        <pre><code>${escapeHtml(jsonResume)}</code></pre>
      </div>
    </div>

    <style>
      .json-actions {
        display: flex;
        gap: var(--space-3);
        margin-bottom: var(--space-4);
      }

      .json-container {
        padding: var(--space-4);
        overflow: auto;
        max-height: 600px;
      }

      .json-container pre {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        line-height: 1.6;
        color: var(--text-secondary);
      }

      .json-container code {
        white-space: pre;
      }
    </style>
  `;

  document.getElementById('copy-json')?.addEventListener('click', () => {
    navigator.clipboard.writeText(jsonResume);
    alert('Copied to clipboard!');
  });

  document.getElementById('download-json')?.addEventListener('click', () => {
    const blob = new Blob([jsonResume], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chirag-singhal-resume.json';
    a.click();
    URL.revokeObjectURL(url);
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
