/**
 * Project Me - Virtual File System Router
 * Hash-based routing with dynamic component loading
 */

import { store } from '../data/store';

export interface Route {
  path: string;
  name: string;
  icon: string;
  component: () => Promise<{ default: (container: HTMLElement) => void | Promise<void> }>;
  drive: string;
  breadcrumb: string[];
  category?: string;
}

export interface RouterConfig {
  routes: Route[];
  defaultRoute: string;
  onNavigate?: (route: Route) => void;
}

// Route definitions for all 45+ pages
export const routes: Route[] = [
  // Drive A: /ME (The Digital Twin)
  { path: '/me/index', name: 'Dashboard', icon: '🏠', component: () => import('../apps/me/Dashboard'), drive: 'ME', breadcrumb: ['Me', 'Dashboard'], category: 'Home' },
  { path: '/me/story', name: 'Story', icon: '📖', component: () => import('../apps/me/Story'), drive: 'ME', breadcrumb: ['Me', 'Story'], category: 'About' },
  { path: '/me/philosophy', name: 'Philosophy', icon: '🧠', component: () => import('../apps/me/Philosophy'), drive: 'ME', breadcrumb: ['Me', 'Philosophy'], category: 'About' },
  { path: '/me/journal', name: 'Journal', icon: '📝', component: () => import('../apps/me/Journal'), drive: 'ME', breadcrumb: ['Me', 'Journal'], category: 'About' },
  { path: '/me/interests', name: 'Interests', icon: '💡', component: () => import('../apps/me/Interests'), drive: 'ME', breadcrumb: ['Me', 'Interests'], category: 'Interests' },
  { path: '/me/passions', name: 'Passions', icon: '❤️', component: () => import('../apps/me/Passions'), drive: 'ME', breadcrumb: ['Me', 'Passions'], category: 'Interests' },
  { path: '/me/hobbies', name: 'Hobbies', icon: '🎯', component: () => import('../apps/me/Hobbies'), drive: 'ME', breadcrumb: ['Me', 'Hobbies'], category: 'Interests' },

  { path: '/me/gear', name: 'Gear', icon: '⚙️', component: () => import('../apps/me/Gear'), drive: 'ME', breadcrumb: ['Me', 'Gear'], category: 'Setup' },
  { path: '/me/travel', name: 'Travel', icon: '✈️', component: () => import('../apps/me/Travel'), drive: 'ME', breadcrumb: ['Me', 'Travel'], category: 'Setup' },
  { path: '/me/purchases', name: 'Purchases', icon: '🛒', component: () => import('../apps/me/Purchases'), drive: 'ME', breadcrumb: ['Me', 'Purchases'], category: 'Setup' },
  { path: '/me/purchase-analytics', name: 'Analytics', icon: '📊', component: () => import('../apps/me/PurchaseAnalytics'), drive: 'ME', breadcrumb: ['Me', 'Purchases', 'Analytics'], category: 'Setup' },
  { path: '/me/finance', name: 'Finance', icon: '💰', component: () => import('../apps/me/FinancialAnalytics'), drive: 'ME', breadcrumb: ['Me', 'Finance'], category: 'Setup' },

  // Drive B: /WORK (Professional)
  { path: '/work/index', name: 'Summary', icon: '💼', component: () => import('../apps/work/Summary'), drive: 'WORK', breadcrumb: ['Work', 'Summary'], category: 'Resume' },
  { path: '/work/history', name: 'Experience', icon: '📋', component: () => import('../apps/work/Experience'), drive: 'WORK', breadcrumb: ['Work', 'Experience'], category: 'Career' },
  { path: '/work/tcs', name: 'TCS', icon: '🏢', component: () => import('../apps/work/TCS'), drive: 'WORK', breadcrumb: ['Work', 'TCS'], category: 'Career' },
  { path: '/work/skills', name: 'Skills', icon: '🎯', component: () => import('../apps/work/Skills'), drive: 'WORK', breadcrumb: ['Work', 'Skills'], category: 'Capabilities' },
  { path: '/work/projects', name: 'Projects', icon: '🚀', component: () => import('../apps/work/Projects'), drive: 'WORK', breadcrumb: ['Work', 'Projects'], category: 'Capabilities' },
  { path: '/work/services', name: 'Services', icon: '🛠️', component: () => import('../apps/work/Services'), drive: 'WORK', breadcrumb: ['Work', 'Services'], category: 'Capabilities' },
  { path: '/work/education', name: 'Education', icon: '🎓', component: () => import('../apps/work/Education'), drive: 'WORK', breadcrumb: ['Work', 'Education'], category: 'Credentials' },
  { path: '/work/certs', name: 'Certifications', icon: '🏆', component: () => import('../apps/work/Certs'), drive: 'WORK', breadcrumb: ['Work', 'Certifications'], category: 'Credentials' },

  // Drive C: /CODE (The Quantified Coder)
  { path: '/code/stats', name: 'Stats', icon: '📊', component: () => import('../apps/code/Stats'), drive: 'CODE', breadcrumb: ['Code', 'Stats'], category: 'Analytics' },
  { path: '/code/leetcode', name: 'LeetCode', icon: '🧩', component: () => import('../apps/code/LeetCode'), drive: 'CODE', breadcrumb: ['Code', 'LeetCode'], category: 'Analytics' },
  { path: '/code/stack', name: 'Reputation', icon: '🏅', component: () => import('../apps/code/Reputation'), drive: 'CODE', breadcrumb: ['Code', 'Reputation'], category: 'Analytics' },
  { path: '/code/repos', name: 'Repos', icon: '📁', component: () => import('../apps/code/Repos'), drive: 'CODE', breadcrumb: ['Code', 'Repos'], category: 'Portfolio' },
  { path: '/code/npm', name: 'NPM', icon: '📦', component: () => import('../apps/code/NPM'), drive: 'CODE', breadcrumb: ['Code', 'NPM'], category: 'Portfolio' },
  { path: '/code/json', name: 'Resume JSON', icon: '📄', component: () => import('../apps/code/ResumeJSON'), drive: 'CODE', breadcrumb: ['Code', 'Resume JSON'], category: 'Portfolio' },

  // Drive D: /LIBRARY (Media Archive)
  { path: '/library/index', name: 'Hub', icon: '📚', component: () => import('../apps/library/Hub'), drive: 'LIBRARY', breadcrumb: ['Library', 'Hub'], category: 'Overview' },

  // Movies & TV Shows
  { path: '/library/movies', name: 'Movies', icon: '🎬', component: () => import('../apps/library/Movies'), drive: 'LIBRARY', breadcrumb: ['Library', 'Movies'], category: 'Movies & TV' },
  { path: '/library/tv-shows', name: 'TV Shows', icon: '📺', component: () => import('../apps/library/TVShows'), drive: 'LIBRARY', breadcrumb: ['Library', 'TV Shows'], category: 'Movies & TV' },
  { path: '/library/watch-activity', name: 'Watch Activity', icon: '🎫', component: () => import('../apps/library/WatchActivity'), drive: 'LIBRARY', breadcrumb: ['Library', 'Watch Activity'], category: 'Movies & TV' },
  { path: '/library/ratings', name: 'Ratings', icon: '⭐', component: () => import('../apps/library/Ratings'), drive: 'LIBRARY', breadcrumb: ['Library', 'Ratings'], category: 'Movies & TV' },
  { path: '/library/collection', name: 'Collection', icon: '📀', component: () => import('../apps/library/Collection'), drive: 'LIBRARY', breadcrumb: ['Library', 'Collection'], category: 'Movies & TV' },
  { path: '/library/lists', name: 'Lists', icon: '📋', component: () => import('../apps/library/Lists'), drive: 'LIBRARY', breadcrumb: ['Library', 'Lists'], category: 'Movies & TV' },
  { path: '/library/social', name: 'Social', icon: '👥', component: () => import('../apps/library/Social'), drive: 'LIBRARY', breadcrumb: ['Library', 'Social'], category: 'Movies & TV' },

  // Music
  { path: '/library/music-now-playing', name: 'Now Playing', icon: '🎵', component: () => import('../apps/library/MusicNowPlaying'), drive: 'LIBRARY', breadcrumb: ['Library', 'Music', 'Now Playing'], category: 'Music' },
  { path: '/library/music-recent', name: 'Recent Tracks', icon: '🎧', component: () => import('../apps/library/MusicRecent'), drive: 'LIBRARY', breadcrumb: ['Library', 'Music', 'Recent'], category: 'Music' },
  { path: '/library/music-top', name: 'Top Tracks', icon: '🏆', component: () => import('../apps/library/MusicTop'), drive: 'LIBRARY', breadcrumb: ['Library', 'Music', 'Top'], category: 'Music' },
  { path: '/library/music-loved', name: 'Loved Tracks', icon: '❤️', component: () => import('../apps/library/MusicLovedTracks'), drive: 'LIBRARY', breadcrumb: ['Library', 'Music', 'Loved'], category: 'Music' },
  { path: '/library/music-friends', name: 'Friends', icon: '👥', component: () => import('../apps/library/MusicFriends'), drive: 'LIBRARY', breadcrumb: ['Library', 'Music', 'Friends'], category: 'Music' },
  { path: '/library/music-tags', name: 'Tags', icon: '🏷️', component: () => import('../apps/library/MusicTags'), drive: 'LIBRARY', breadcrumb: ['Library', 'Music', 'Tags'], category: 'Music' },
  { path: '/library/music-charts', name: 'Charts', icon: '📊', component: () => import('../apps/library/MusicCharts'), drive: 'LIBRARY', breadcrumb: ['Library', 'Music', 'Charts'], category: 'Music' },
  { path: '/library/music-profile', name: 'Profile', icon: '👤', component: () => import('../apps/library/MusicProfile'), drive: 'LIBRARY', breadcrumb: ['Library', 'Music', 'Profile'], category: 'Music' },

  // Books
  { path: '/library/books-read', name: 'Books Read', icon: '📕', component: () => import('../apps/library/BooksRead'), drive: 'LIBRARY', breadcrumb: ['Library', 'Books', 'Read'], category: 'Books' },
  { path: '/library/books-tbr', name: 'Books TBR', icon: '📗', component: () => import('../apps/library/BooksTBR'), drive: 'LIBRARY', breadcrumb: ['Library', 'Books', 'TBR'], category: 'Books' },
  { path: '/library/books-reading', name: 'Currently Reading', icon: '📖', component: () => import('../apps/library/BooksCurrentlyReading'), drive: 'LIBRARY', breadcrumb: ['Library', 'Books', 'Reading'], category: 'Books' },

  // Anime & Manga
  { path: '/library/anime', name: 'Anime', icon: '🎌', component: () => import('../apps/library/Anime'), drive: 'LIBRARY', breadcrumb: ['Library', 'Anime'], category: 'Anime & Manga' },
  { path: '/library/manga', name: 'Manga', icon: '📰', component: () => import('../apps/library/Manga'), drive: 'LIBRARY', breadcrumb: ['Library', 'Manga'], category: 'Anime & Manga' },

  // Web
  { path: '/library/browse-history', name: 'Browse History', icon: '🌐', component: () => import('../apps/library/BrowseHistory'), drive: 'LIBRARY', breadcrumb: ['Library', 'Browse History'], category: 'Web' },
  { path: '/library/videos', name: 'Videos', icon: '📹', component: () => import('../apps/library/Videos'), drive: 'LIBRARY', breadcrumb: ['Library', 'Videos'], category: 'Web' },


  // Drive E: /GAMING (The Arcade)
  { path: '/gaming/index', name: 'Profile', icon: '🎮', component: () => import('../apps/gaming/Profile'), drive: 'GAMING', breadcrumb: ['Gaming', 'Profile'] },
  { path: '/gaming/retro', name: 'Trophies', icon: '🏅', component: () => import('../apps/gaming/Trophies'), drive: 'GAMING', breadcrumb: ['Gaming', 'Trophies'] },
  { path: '/gaming/chess', name: 'Chess', icon: '♟️', component: () => import('../apps/gaming/Chess'), drive: 'GAMING', breadcrumb: ['Gaming', 'Chess'] },
  { path: '/gaming/speed', name: 'Speedrun', icon: '⏱️', component: () => import('../apps/gaming/Speedrun'), drive: 'GAMING', breadcrumb: ['Gaming', 'Speedrun'] },

  // Drive F: /CONNECT (Social)
  { path: '/connect/index', name: 'Hub', icon: '🌐', component: () => import('../apps/connect/Hub'), drive: 'CONNECT', breadcrumb: ['Connect', 'Hub'] },
  { path: '/connect/feed', name: 'Feed', icon: '📡', component: () => import('../apps/connect/Feed'), drive: 'CONNECT', breadcrumb: ['Connect', 'Feed'] },
  { path: '/connect/photos', name: 'Photos', icon: '📸', component: () => import('../apps/connect/Photos'), drive: 'CONNECT', breadcrumb: ['Connect', 'Photos'] },
  { path: '/connect/blog', name: 'Articles', icon: '✍️', component: () => import('../apps/connect/Articles'), drive: 'CONNECT', breadcrumb: ['Connect', 'Articles'] },
  { path: '/connect/threads', name: 'Discussion', icon: '💬', component: () => import('../apps/connect/Discussion'), drive: 'CONNECT', breadcrumb: ['Connect', 'Discussion'] },
  { path: '/connect/mail', name: 'Contact', icon: '✉️', component: () => import('../apps/connect/Contact'), drive: 'CONNECT', breadcrumb: ['Connect', 'Contact'] },

  // Drive G: /SYSTEM (OS Tools)
  { path: '/system/search', name: 'Search', icon: '🔍', component: () => import('../apps/system/Search'), drive: 'SYSTEM', breadcrumb: ['System', 'Search'] },
  { path: '/system/ai', name: 'AI Chat', icon: '🤖', component: () => import('../apps/system/AI'), drive: 'SYSTEM', breadcrumb: ['System', 'AI Chat'] },
  { path: '/system/settings', name: 'Settings', icon: '⚙️', component: () => import('../apps/system/Settings'), drive: 'SYSTEM', breadcrumb: ['System', 'Settings'] },
  { path: '/system/uptime', name: 'Status', icon: '📈', component: () => import('../apps/system/Status'), drive: 'SYSTEM', breadcrumb: ['System', 'Status'] },
  { path: '/system/weather', name: 'Weather', icon: '🌤️', component: () => import('../apps/system/Weather'), drive: 'SYSTEM', breadcrumb: ['System', 'Weather'] },
];

class Router {
  private routes: Map<string, Route> = new Map();
  private currentRoute: Route | null = null;
  private contentContainer: HTMLElement | null = null;
  private onNavigateCallback?: (route: Route) => void;

  constructor() {
    routes.forEach(route => this.routes.set(route.path, route));

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  init(container: HTMLElement, onNavigate?: (route: Route) => void): void {
    this.contentContainer = container;
    this.onNavigateCallback = onNavigate;
    this.handleRouteChange();
  }

  private async handleRouteChange(): Promise<void> {
    const hash = window.location.hash.slice(1) || '/work/index';
    const route = this.routes.get(hash) || this.routes.get('/work/index')!;

    if (route && this.contentContainer) {
      this.currentRoute = route;
      store.currentRoute.set(route.path);

      // Show loading state
      this.contentContainer.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading ${route.name}...</p>
        </div>
      `;

      try {
        const module = await route.component();
        this.contentContainer.innerHTML = '';
        await module.default(this.contentContainer);

        // Update document title
        document.title = `${route.name} — Chirag Singhal | Software Engineer`;

        if (this.onNavigateCallback) {
          this.onNavigateCallback(route);
        }
      } catch (error) {
        console.error('Failed to load route:', error);
        this.contentContainer.innerHTML = `
          <div class="error-container">
            <h2>Failed to load ${route.name}</h2>
            <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
            <button onclick="location.hash = '#/work/index'">Go Home</button>
          </div>
        `;
      }
    }
  }

  navigate(path: string): void {
    window.location.hash = path;
  }

  getCurrentRoute(): Route | null {
    return this.currentRoute;
  }

  getRoutesByDrive(drive: string): Route[] {
    return routes.filter(r => r.drive === drive);
  }

  getDrives(): string[] {
    return [...new Set(routes.map(r => r.drive))];
  }

  getAllRoutes(): Route[] {
    return routes;
  }
}

export const router = new Router();
export default router;
