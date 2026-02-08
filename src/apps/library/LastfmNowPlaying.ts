/**
 * Music Page - Displays listening history from Last.fm
 * Liquid Glass 2026 Design
 */

interface Track {
  name: string;
  artist: string;
  album: string;
  image: string;
  playCount: number;
  nowPlaying?: boolean;
}

interface Artist {
  name: string;
  image: string;
  playCount: number;
}

export default async function Music(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🎵 Music</h1>
        <p class="page-subtitle">My listening journey on Last.fm</p>
      </header>

      <div class="music-now-playing glass" id="now-playing-section">
        <div class="now-playing-content">
          <div class="now-playing-art" id="now-playing-art">
            <div class="placeholder-art">🎧</div>
          </div>
          <div class="now-playing-info">
            <span class="now-playing-label">Now Playing</span>
            <h2 id="now-playing-track">Not playing anything</h2>
            <p id="now-playing-artist">--</p>
          </div>
          <div class="sound-wave" id="sound-wave">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div class="music-stats">
        <div class="stat-card glass">
          <span class="stat-value" id="total-scrobbles">--</span>
          <span class="stat-label">Scrobbles</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="total-artists">--</span>
          <span class="stat-label">Artists</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="total-albums">--</span>
          <span class="stat-label">Albums</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="listening-time">--</span>
          <span class="stat-label">Hours</span>
        </div>
      </div>

      <div class="music-sections">
        <section class="music-section">
          <h3>🔥 Top Artists</h3>
          <div class="artists-grid" id="top-artists"></div>
        </section>

        <section class="music-section">
          <h3>🎶 Recent Tracks</h3>
          <div class="tracks-list" id="recent-tracks"></div>
        </section>
      </div>
    </div>

    <style>
      .music-now-playing.glass {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
        backdrop-filter: blur(20px);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: var(--radius-2xl);
        padding: var(--space-6);
        margin-bottom: var(--space-6);
      }

      .now-playing-content {
        display: flex;
        align-items: center;
        gap: var(--space-5);
      }

      .now-playing-art {
        width: 100px;
        height: 100px;
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: rgba(0, 0, 0, 0.3);
        flex-shrink: 0;
      }

      .now-playing-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .placeholder-art {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
      }

      .now-playing-info {
        flex: 1;
      }

      .now-playing-label {
        font-size: var(--text-xs);
        color: #22c55e;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: var(--space-1);
        display: block;
      }

      .now-playing-info h2 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-1);
      }

      .now-playing-info p {
        color: var(--text-secondary);
      }

      .sound-wave {
        display: flex;
        align-items: flex-end;
        gap: 3px;
        height: 40px;
      }

      .sound-wave span {
        width: 4px;
        background: linear-gradient(to top, #6366f1, #a855f7);
        border-radius: 2px;
        animation: wave 1s ease-in-out infinite;
      }

      .sound-wave span:nth-child(1) { height: 20px; animation-delay: 0s; }
      .sound-wave span:nth-child(2) { height: 35px; animation-delay: 0.1s; }
      .sound-wave span:nth-child(3) { height: 25px; animation-delay: 0.2s; }
      .sound-wave span:nth-child(4) { height: 40px; animation-delay: 0.3s; }
      .sound-wave span:nth-child(5) { height: 30px; animation-delay: 0.4s; }

      @keyframes wave {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(0.5); }
      }

      .music-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      .stat-card.glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-5);
        text-align: center;
      }

      .stat-card .stat-value {
        display: block;
        font-size: var(--text-3xl);
        font-weight: 700;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-card .stat-label {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      .music-sections {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-6);
      }

      .music-section h3 {
        margin-bottom: var(--space-4);
      }

      .artists-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-3);
      }

      .artist-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-4);
        text-align: center;
        transition: all 0.3s ease;
      }

      .artist-card:hover {
        transform: translateY(-4px);
        border-color: rgba(99, 102, 241, 0.3);
      }

      .artist-avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        margin: 0 auto var(--space-3);
        background: linear-gradient(135deg, #6366f1, #a855f7);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        overflow: hidden;
      }

      .artist-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .artist-name {
        font-size: var(--text-sm);
        font-weight: 600;
        margin-bottom: var(--space-1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .artist-plays {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .tracks-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .track-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3);
        background: rgba(255, 255, 255, 0.03);
        border-radius: var(--radius-lg);
        transition: all 0.2s ease;
      }

      .track-item:hover {
        background: rgba(255, 255, 255, 0.06);
      }

      .track-art {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        background: rgba(0, 0, 0, 0.3);
        overflow: hidden;
        flex-shrink: 0;
      }

      .track-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .track-info {
        flex: 1;
        min-width: 0;
      }

      .track-name {
        font-size: var(--text-sm);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-artist {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .track-time {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      @media (max-width: 768px) {
        .music-stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .music-sections {
          grid-template-columns: 1fr;
        }

        .artists-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    </style>
  `;

  await loadMusicData();
}

async function loadMusicData(): Promise<void> {
  // Demo data - In production, fetch from Last.fm API
  const demoArtists: Artist[] = [
    { name: "The Weeknd", image: "", playCount: 1423 },
    { name: "Daft Punk", image: "", playCount: 987 },
    { name: "Kendrick Lamar", image: "", playCount: 856 },
    { name: "Taylor Swift", image: "", playCount: 743 },
    { name: "Arctic Monkeys", image: "", playCount: 621 },
    { name: "Radiohead", image: "", playCount: 589 }
  ];

  const demoTracks: Track[] = [
    { name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", image: "", playCount: 234 },
    { name: "Get Lucky", artist: "Daft Punk", album: "Random Access Memories", image: "", playCount: 189 },
    { name: "HUMBLE.", artist: "Kendrick Lamar", album: "DAMN.", image: "", playCount: 156 },
    { name: "Anti-Hero", artist: "Taylor Swift", album: "Midnights", image: "", playCount: 134 },
    { name: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", image: "", playCount: 112 }
  ];

  // Update stats
  document.getElementById('total-scrobbles')!.textContent = '12,847';
  document.getElementById('total-artists')!.textContent = '456';
  document.getElementById('total-albums')!.textContent = '892';
  document.getElementById('listening-time')!.textContent = '1,234';

  // Render artists
  const artistsGrid = document.getElementById('top-artists');
  if (artistsGrid) {
    artistsGrid.innerHTML = demoArtists.map(artist => `
      <div class="artist-card">
        <div class="artist-avatar">
          ${artist.image ? `<img src="${artist.image}" alt="${artist.name}">` : '🎤'}
        </div>
        <div class="artist-name">${artist.name}</div>
        <div class="artist-plays">${artist.playCount.toLocaleString()} plays</div>
      </div>
    `).join('');
  }

  // Render tracks
  const tracksList = document.getElementById('recent-tracks');
  if (tracksList) {
    tracksList.innerHTML = demoTracks.map(track => `
      <div class="track-item">
        <div class="track-art">
          ${track.image ? `<img src="${track.image}" alt="${track.album}">` : '🎵'}
        </div>
        <div class="track-info">
          <div class="track-name">${track.name}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
        <div class="track-time">${track.playCount} plays</div>
      </div>
    `).join('');
  }
}
