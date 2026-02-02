// Library Hub
import { getAggregateMediaStats } from '../../services/media';
import { formatNumber } from '../../services/utility';

export default async function Hub(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Media Library</h1>
        <p class="page-subtitle">Books, music, movies, anime, and more</p>
      </header>
      <div class="bento-grid" id="media-grid">
        <div class="bento-item"><h3>🎵 Music</h3><p id="scrobbles">Loading...</p><a href="#/library/music/recent" class="btn btn-ghost">Recent →</a></div>
        <div class="bento-item"><h3>📺 Anime</h3><p id="anime-stats">Loading...</p><a href="#/library/anime" class="btn btn-ghost">View →</a></div>
        <div class="bento-item"><h3>📖 Manga</h3><p id="manga-stats">Loading...</p><a href="#/library/manga" class="btn btn-ghost">View →</a></div>
        <div class="bento-item"><h3>🎬 Movies</h3><a href="#/library/cinema" class="btn btn-ghost">Letterboxd →</a></div>
        <div class="bento-item"><h3>📚 Books</h3><a href="#/library/books/read" class="btn btn-ghost">Reading List →</a></div>
      </div>
    </div>
  `;
  try {
    const stats = await getAggregateMediaStats();
    const scrobbles = document.getElementById('scrobbles');
    const anime = document.getElementById('anime-stats');
    const manga = document.getElementById('manga-stats');
    if (scrobbles) scrobbles.textContent = `${formatNumber(stats.music.totalScrobbles)} scrobbles`;
    if (anime) anime.textContent = `${stats.anime.completed} completed, ${stats.anime.watching} watching`;
    if (manga) manga.textContent = `${stats.manga.completed} completed, ${stats.manga.reading} reading`;
  } catch {}
}
