/**
 * Project Me - Dashboard (Now Page)
 * Real-time status, Now Playing, weather, Discord status
 */

import { RESUME } from '../../data/resume';
import { getDiscordStatus } from '../../services/utility';
import { getNowPlaying } from '../../services/media';
import { getAggregateCodingStats } from '../../services/coding';
import CONFIG from '../../config';
import { getGreeting, getLocalDate, formatNumber } from '../../services/utility';

export default async function Dashboard(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">${getGreeting()}, I'm ${RESUME.personal.firstName}</h1>
        <p class="page-subtitle">${RESUME.personal.position} • ${RESUME.personal.tagline}</p>
      </header>

      <div class="bento-grid">
        <!-- Status Card -->
        <div class="bento-item span-2" id="status-card">
          <div class="status-header">
            <span class="status-dot" id="discord-dot"></span>
            <span id="discord-status">Loading...</span>
          </div>
          <div class="now-info">
            <p id="current-date">${getLocalDate()}</p>
            <p id="current-activity">Loading activity...</p>
          </div>
        </div>

        <!-- Now Playing -->
        <div class="bento-item" id="music-card">
          <div class="card-header">
            <span class="card-icon">🎵</span>
            <h3>Now Playing</h3>
          </div>
          <div class="now-playing" id="now-playing">
            <p class="muted">Not playing anything</p>
          </div>
        </div>

        <!-- About Card -->
        <div class="bento-item">
          <div class="card-header">
            <span class="card-icon">👤</span>
            <h3>About</h3>
          </div>
          <p class="about-text">${RESUME.summary.slice(0, 200)}...</p>
          <a href="#/me/story" class="btn btn-ghost">Read More →</a>
        </div>

        <!-- Skills Preview -->
        <div class="bento-item span-2">
          <div class="card-header">
            <span class="card-icon">🎯</span>
            <h3>Top Skills</h3>
          </div>
          <div class="skills-preview">
            ${RESUME.skills.slice(0, 2).map(category => `
              <div class="skill-category">
                <h4>${category.category}</h4>
                <div class="skill-tags">
                  ${category.skills.slice(0, 5).map(skill => `
                    <span class="tag">${skill}</span>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          <a href="#/work/skills" class="btn btn-ghost">View All Skills →</a>
        </div>

        <!-- Quick Links -->
        <div class="bento-item">
          <div class="card-header">
            <span class="card-icon">🔗</span>
            <h3>Quick Links</h3>
          </div>
          <div class="quick-links">
            <a href="https://github.com/${RESUME.personal.github}" target="_blank" class="quick-link">
              <span>GitHub</span>
              <span>→</span>
            </a>
            <a href="https://linkedin.com/in/${RESUME.personal.linkedin}" target="_blank" class="quick-link">
              <span>LinkedIn</span>
              <span>→</span>
            </a>
            <a href="mailto:${RESUME.personal.email}" class="quick-link">
              <span>Email</span>
              <span>→</span>
            </a>
          </div>
        </div>

        <!-- Featured Project -->
        <div class="bento-item span-2">
          <div class="card-header">
            <span class="card-icon">🚀</span>
            <h3>Featured Project</h3>
          </div>
          <div class="project-preview">
            <h4>${RESUME.projects[0].name}</h4>
            <div class="project-tech">
              ${RESUME.projects[0].techStack.map(t => `<span class="tag primary">${t}</span>`).join('')}
            </div>
            <p>${RESUME.projects[0].highlights[0].slice(0, 120)}...</p>
          </div>
          <a href="#/work/projects" class="btn btn-ghost">View Projects →</a>
        </div>

        <!-- Quick Stats -->
        <div class="bento-item span-2" id="stats-card">
          <div class="card-header">
            <span class="card-icon">📊</span>
            <h3>Coding Stats</h3>
          </div>
          <div class="stats-grid" id="stats-grid">
            <div class="stat-item">
              <span class="stat-value" id="stat-repos">--</span>
              <span class="stat-label">Repositories</span>
            </div>
            <div class="stat-item">
              <span class="stat-value" id="stat-stars">--</span>
              <span class="stat-label">GitHub Stars</span>
            </div>
            <div class="stat-item">
              <span class="stat-value" id="stat-leetcode">--</span>
              <span class="stat-label">LeetCode Solved</span>
            </div>
            <div class="stat-item">
              <span class="stat-value" id="stat-followers">--</span>
              <span class="stat-label">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .status-header {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-3);
      }

      .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--accent-green);
        animation: pulse 2s infinite;
      }

      .now-info {
        color: var(--text-secondary);
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-4);
      }

      .card-header h3 {
        font-size: var(--text-base);
        font-weight: 600;
      }

      .card-icon {
        font-size: var(--text-xl);
      }



      .now-playing {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      .now-playing-art {
        width: 60px;
        height: 60px;
        border-radius: var(--radius-md);
        object-fit: cover;
      }

      .now-playing-info {
        flex: 1;
      }

      .now-playing-track {
        font-weight: 600;
        margin-bottom: var(--space-1);
      }

      .now-playing-artist {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .muted {
        color: var(--text-tertiary);
        font-style: italic;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
      }

      .stat-item {
        text-align: center;
      }

      .stat-item .stat-value {
        display: block;
        font-size: var(--text-2xl);
        font-weight: 700;
        font-family: var(--font-mono);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-item .stat-label {
        font-size: var(--text-xs);
        color: var(--text-secondary);
      }

      .about-text {
        color: var(--text-secondary);
        font-size: var(--text-sm);
        line-height: 1.7;
        margin-bottom: var(--space-4);
      }

      .skills-preview {
        display: flex;
        gap: var(--space-6);
        margin-bottom: var(--space-4);
      }

      .skill-category h4 {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin-bottom: var(--space-2);
      }

      .skill-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      .project-preview h4 {
        margin-bottom: var(--space-2);
      }

      .project-tech {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-1);
        margin-bottom: var(--space-3);
      }

      .project-preview p {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin-bottom: var(--space-3);
      }

      .quick-links {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .quick-link {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-3);
        background: var(--glass-bg);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        transition: all var(--transition-fast);
      }

      .quick-link:hover {
        background: var(--glass-bg-hover);
        transform: translateX(4px);
      }

      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .skills-preview {
          flex-direction: column;
          gap: var(--space-4);
        }
      }
    </style>
  `;

  // Load dynamic data
  loadDiscordStatus();
  loadNowPlaying();
  loadCodingStats();
}



async function loadDiscordStatus(): Promise<void> {
  try {
    const status = await getDiscordStatus();

    const dot = document.getElementById('discord-dot') as HTMLElement;
    const statusText = document.getElementById('discord-status');
    const activity = document.getElementById('current-activity');

    if (dot) {
      dot.style.background = status.statusColor;
    }

    if (statusText) {
      statusText.textContent = status.status.charAt(0).toUpperCase() + status.status.slice(1);
    }

    if (activity) {
      if (status.spotify) {
        activity.textContent = `🎧 Listening to ${status.spotify.song} by ${status.spotify.artist}`;
      } else if (status.activity) {
        activity.textContent = `${status.activity}`;
      } else {
        activity.textContent = 'Doing something awesome...';
      }
    }
  } catch (error) {
    console.error('Failed to load Discord status:', error);
  }
}

async function loadNowPlaying(): Promise<void> {
  try {
    const track = await getNowPlaying();
    const container = document.getElementById('now-playing');

    if (container) {
      if (track) {
        const image = track.image.find(img => img.size === 'large')?.['#text'] || '';
        container.innerHTML = `
          ${image ? `<img src="${image}" alt="Album art" class="now-playing-art">` : ''}
          <div class="now-playing-info">
            <div class="now-playing-track">${track.name}</div>
            <div class="now-playing-artist">${track.artist['#text']}</div>
          </div>
        `;
      } else {
        container.innerHTML = '<p class="muted">Not playing anything</p>';
      }
    }
  } catch (error) {
    console.error('Failed to load now playing:', error);
  }
}

async function loadCodingStats(): Promise<void> {
  try {
    const stats = await getAggregateCodingStats();

    const reposEl = document.getElementById('stat-repos');
    const starsEl = document.getElementById('stat-stars');
    const leetcodeEl = document.getElementById('stat-leetcode');
    const followersEl = document.getElementById('stat-followers');

    if (reposEl) reposEl.textContent = formatNumber(stats.github.repos);
    if (starsEl) starsEl.textContent = formatNumber(stats.github.stars);
    if (leetcodeEl) leetcodeEl.textContent = formatNumber(stats.leetcode.solved);
    if (followersEl) followersEl.textContent = formatNumber(stats.github.followers);
  } catch (error) {
    console.error('Failed to load coding stats:', error);
  }
}
