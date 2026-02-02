// Gaming Profile
import { getAggregateGamingStats } from '../../services/gaming';
import { getSteamProfileUrl } from '../../services/gaming';

export default async function Profile(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Gaming</h1><p class="page-subtitle">Player profiles and achievements</p></header><div class="bento-grid"><div class="bento-item"><h3>♟️ Chess</h3><div id="chess-stats">Loading...</div><a href="#/gaming/chess" class="btn btn-ghost">View →</a></div><div class="bento-item"><h3>🎮 Steam</h3><a href="${getSteamProfileUrl()}" target="_blank" class="btn btn-ghost">Steam Profile →</a></div><div class="bento-item"><h3>🏅 RetroAchievements</h3><div id="retro-stats">Loading...</div></div><div class="bento-item"><h3>⏱️ Speedrun</h3><div id="speedrun-stats">Loading...</div></div></div></div>`;
  try {
    const stats = await getAggregateGamingStats();
    const chess = document.getElementById('chess-stats');
    const retro = document.getElementById('retro-stats');
    const speedrun = document.getElementById('speedrun-stats');
    if (chess) chess.innerHTML = Object.entries(stats.chess.ratings).map(([k, v]) => `<p>${k}: ${v}</p>`).join('') || '<p class="muted">No ratings</p>';
    if (retro) retro.innerHTML = `<p>${stats.retro.points} points</p>`;
    if (speedrun) speedrun.innerHTML = `<p>${stats.speedrun.pbs} PBs</p>`;
  } catch {}
}
