/**
 * Project Me - Travel Page
 * Map visualization of places visited
 */

export default async function Travel(container: HTMLElement): Promise<void> {
  const places = [
    { name: 'Ghaziabad', type: 'Home', year: 'Birth' },
    { name: 'Bhubaneswar', type: 'Work', year: '2024-Present' },
    { name: 'Lucknow', type: 'Education', year: '2020-2024' },
    { name: 'Delhi NCR', type: 'Explored', year: 'Various' },
  ];

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Travel</h1>
        <p class="page-subtitle">Places I've lived, worked, and explored</p>
      </header>

      <div class="bento-grid">
        ${places.map(place => `
          <div class="bento-item">
            <div class="place-type">${place.type}</div>
            <h3>${place.name}</h3>
            <p class="place-year">${place.year}</p>
          </div>
        `).join('')}

        <div class="bento-item span-2">
          <h3>🌏 Bucket List</h3>
          <div class="bucket-list">
            <span class="tag">Japan 🇯🇵</span>
            <span class="tag">Switzerland 🇨🇭</span>
            <span class="tag">Iceland 🇮🇸</span>
            <span class="tag">New Zealand 🇳🇿</span>
            <span class="tag">Norway 🇳🇴</span>
          </div>
        </div>
      </div>
    </div>

    <style>
      .place-type {
        font-size: var(--text-xs);
        color: var(--accent-blue);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: var(--space-2);
      }

      .place-year {
        color: var(--text-tertiary);
        font-size: var(--text-sm);
        margin-top: var(--space-1);
      }

      .bucket-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-top: var(--space-4);
      }
    </style>
  `;
}
