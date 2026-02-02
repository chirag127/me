// Steam
import { getSteamProfileUrl, getSteamGamesPlaceholder } from '../../services/gaming';

export default async function Steam(c: HTMLElement): Promise<void> {
  const games = getSteamGamesPlaceholder();
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Steam</h1><p class="page-subtitle">Gaming library and hours</p></header><div class="games-grid">${games.map(g => `<div class="game-card glass-panel"><h4>${g.name}</h4><p>${g.playtime_forever}h played</p></div>`).join('')}</div><div class="cta glass-panel"><a href="${getSteamProfileUrl()}" target="_blank" class="btn btn-primary">View Steam Profile →</a></div></div><style>.games-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--space-4);margin-bottom:var(--space-6)}.game-card{padding:var(--space-4)}.cta{padding:var(--space-6);text-align:center}</style>`;
}
