/**
 * Project Me - Hobbies Page
 * Showcase recreational activities and hobbies
 */

export default async function Hobbies(container: HTMLElement): Promise<void> {
  const hobbies = [
    {
      icon: '🎮',
      title: 'Gaming',
      description: 'From competitive FPS to immersive RPGs, gaming is my favorite way to unwind.',
      stats: ['500+ hours in favorite games', 'Achievement hunter', 'Speedrun enthusiast']
    },
    {
      icon: '📖',
      title: 'Reading',
      description: 'Devouring technical books, sci-fi novels, and thought-provoking non-fiction.',
      stats: ['20+ books/year', 'Sci-Fi & Tech favorites', 'Active Goodreads user']
    },
    {
      icon: '🎵',
      title: 'Music',
      description: 'Curating playlists, discovering artists, and appreciating various genres.',
      stats: ['10K+ tracks scrobbled', 'Last.fm active', 'Lo-fi & Electronic']
    },
    {
      icon: '🏃',
      title: 'Fitness',
      description: 'Staying active through running, home workouts, and outdoor activities.',
      stats: ['Regular workout routine', 'Step tracking', 'Healthy lifestyle']
    },
    {
      icon: '🎬',
      title: 'Movies & TV',
      description: 'Binge-watching quality series and appreciating cinema from around the world.',
      stats: ['Trakt.tv tracker', 'Anime fan', 'Documentary lover']
    },
    {
      icon: '✈️',
      title: 'Travel',
      description: 'Exploring new places, experiencing different cultures, and collecting memories.',
      stats: ['Multiple cities visited', 'Photography enthusiast', 'Adventure seeker']
    },
  ];

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🎯 My Hobbies</h1>
        <p class="page-subtitle">How I spend my time outside of work</p>
      </header>

      <div class="hobbies-grid">
        ${hobbies.map(hobby => `
          <div class="hobby-card glass-panel">
            <div class="hobby-header">
              <span class="hobby-icon">${hobby.icon}</span>
              <h3 class="hobby-title">${hobby.title}</h3>
            </div>
            <p class="hobby-desc">${hobby.description}</p>
            <div class="hobby-stats">
              ${hobby.stats.map(stat => `<span class="hobby-stat">${stat}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <style>
      .hobbies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: var(--space-6);
        margin-top: var(--space-6);
      }

      .hobby-card {
        padding: var(--space-6);
        transition: all var(--transition-base);
      }

      .hobby-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
      }

      .hobby-header {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-4);
      }

      .hobby-icon {
        font-size: var(--text-4xl);
      }

      .hobby-title {
        font-size: var(--text-xl);
        font-weight: 700;
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hobby-desc {
        font-size: var(--text-base);
        color: var(--text-secondary);
        line-height: 1.7;
        margin-bottom: var(--space-4);
      }

      .hobby-stats {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      .hobby-stat {
        font-size: var(--text-xs);
        padding: var(--space-1) var(--space-3);
        background: var(--glass-bg);
        border-radius: var(--radius-full);
        color: var(--text-tertiary);
      }

      @media (max-width: 768px) {
        .hobbies-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
}
