/**
 * Project Me - Global Shell
 * macOS-style UI with Dock, Top Bar, and Window Manager
 */

import { store } from '../data/store';
import { router, routes, type Route } from './router';
import CONFIG from '../config';

export class Shell {
  private appElement: HTMLElement;
  private dockElement: HTMLElement | null = null;
  private topBarElement: HTMLElement | null = null;
  private contentElement: HTMLElement | null = null;

  constructor(appElement: HTMLElement) {
    this.appElement = appElement;
  }

  async init(): Promise<void> {
    this.render();
    this.setupEventListeners();
    this.startClock();

    // Initialize router with content container
    if (this.contentElement) {
      router.init(this.contentElement, (route) => {
        this.updateBreadcrumb(route);
        this.updateActiveNavItem(route.path);
      });
    }

    store.isLoading.set(false);
  }

  private render(): void {
    this.appElement.innerHTML = `
      <!-- Top Bar -->
      <header class="top-bar" id="top-bar">
        <div class="top-bar-left">
          <button class="apple-menu" id="apple-menu" aria-label="Toggle navigation menu">
            <span class="menu-hamburger">☰</span>
            <span class="logo-icon">CS</span>
          </button>
          <nav class="breadcrumb" id="breadcrumb">
            <span>Me</span>
            <span class="separator">›</span>
            <span>Dashboard</span>
          </nav>
        </div>
        <div class="top-bar-center">
          <button class="search-trigger" id="search-trigger">
            <span class="search-icon">⌘K</span>
            <span>Search anything...</span>
          </button>
        </div>
        <div class="top-bar-right">
          <button class="top-bar-icon" id="ai-chat-btn" title="Ask AI">🤖</button>
          <button class="top-bar-icon" id="theme-toggle" title="Toggle theme">🌙</button>
          <span class="clock" id="clock">00:00</span>
        </div>
      </header>

      <div class="main-container">
        <!-- Sidebar Backdrop -->
        <div class="sidebar-backdrop" id="sidebar-backdrop"></div>

        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <div class="profile-mini">
              <div class="avatar">CS</div>
              <div class="profile-info">
                <span class="name">${CONFIG.user.name}</span>
                <span class="status online">● Online</span>
              </div>
            </div>
          </div>

          <nav class="nav-drives">
            ${this.renderDriveNav()}
          </nav>
        </aside>

        <!-- Content Area -->
        <main class="content" id="content">
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </main>
      </div>

      <!-- Dock -->
      <nav class="dock" id="dock">
        <div class="dock-container">
          ${this.renderDockItems()}
        </div>
      </nav>

      <!-- Search Modal -->
      <div class="modal search-modal" id="search-modal">
        <div class="modal-backdrop"></div>
        <div class="modal-content search-content">
          <input type="text" class="search-input" id="search-input" placeholder="Search pages, projects, skills..." autofocus>
          <div class="search-results" id="search-results"></div>
          <div class="search-footer">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>esc Close</span>
          </div>
        </div>
      </div>

      <!-- AI Chat Modal -->
      <div class="modal ai-modal" id="ai-modal">
        <div class="modal-backdrop"></div>
        <div class="modal-content ai-content glass-panel">
          <div class="ai-header">
            <h3>🤖 Ask About Chirag</h3>
            <button class="close-btn" id="ai-close">×</button>
          </div>
          <div class="ai-messages" id="ai-messages">
            <div class="ai-message bot">
              <p>Hi! I'm Chirag's AI assistant. Ask me anything about his experience, skills, or projects!</p>
            </div>
          </div>
          <form class="ai-input-form" id="ai-form">
            <input type="text" id="ai-input" placeholder="Ask about skills, projects, experience...">
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    `;

    this.dockElement = document.getElementById('dock');
    this.topBarElement = document.getElementById('top-bar');
    this.contentElement = document.getElementById('content');
  }

  private renderDriveNav(): string {
    const drives = [
      { id: 'ME', name: 'Me', icon: '👤', color: '#007AFF' },
      { id: 'WORK', name: 'Work', icon: '💼', color: '#5856D6' },
      { id: 'CODE', name: 'Code', icon: '💻', color: '#34C759' },
      { id: 'LIBRARY', name: 'Library', icon: '📚', color: '#FF9500' },
      { id: 'GAMING', name: 'Gaming', icon: '🎮', color: '#FF2D55' },
      { id: 'CONNECT', name: 'Connect', icon: '🌐', color: '#00C7BE' },
      { id: 'SYSTEM', name: 'System', icon: '⚙️', color: '#8E8E93' },
    ];

    return drives.map(drive => {
      const driveRoutes = router.getRoutesByDrive(drive.id);
      return `
        <div class="drive-section" data-drive="${drive.id}">
          <button class="drive-header" style="--drive-color: ${drive.color}">
            <span class="drive-icon">${drive.icon}</span>
            <span class="drive-name">${drive.name}</span>
            <span class="drive-arrow">›</span>
          </button>
          <div class="drive-items">
            ${driveRoutes.map(route => `
              <a href="#${route.path}" class="nav-item" data-path="${route.path}">
                <span class="nav-icon">${route.icon}</span>
                <span class="nav-name">${route.name}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  private renderDockItems(): string {
    // Quick access dock items
    const dockItems = [
      { path: '/me/index', icon: '🏠', name: 'Home' },
      { path: '/work/projects', icon: '🚀', name: 'Projects' },
      { path: '/code/repos', icon: '📁', name: 'Repos' },
      { path: '/library/music/recent', icon: '🎵', name: 'Music' },
      { path: '/connect/mail', icon: '✉️', name: 'Contact' },
      { path: '/system/ai', icon: '🤖', name: 'AI' },
    ];

    return dockItems.map(item => `
      <a href="#${item.path}" class="dock-item" title="${item.name}" data-path="${item.path}">
        <span class="dock-icon">${item.icon}</span>
      </a>
    `).join('');
  }

  private setupEventListeners(): void {
    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      store.toggleTheme();
      this.updateThemeIcon();
    });

    // Search modal
    document.getElementById('search-trigger')?.addEventListener('click', () => this.openSearch());
    document.getElementById('search-modal')?.querySelector('.modal-backdrop')?.addEventListener('click', () => this.closeSearch());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.toggleSearch();
      }
      if (e.key === 'Escape') {
        this.closeSearch();
        this.closeAIChat();
      }
    });

    // Search input
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      this.performSearch(query);
    });

    // AI Chat
    document.getElementById('ai-chat-btn')?.addEventListener('click', () => this.openAIChat());
    document.getElementById('ai-close')?.addEventListener('click', () => this.closeAIChat());
    document.getElementById('ai-modal')?.querySelector('.modal-backdrop')?.addEventListener('click', () => this.closeAIChat());
    document.getElementById('ai-form')?.addEventListener('submit', (e) => this.handleAISubmit(e));

    // Drive sections collapse
    document.querySelectorAll('.drive-header').forEach(header => {
      header.addEventListener('click', () => {
        const section = header.closest('.drive-section');
        section?.classList.toggle('collapsed');
      });
    });

    // Mobile Sidebar Toggle
    document.getElementById('apple-menu')?.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      const menuBtn = document.getElementById('apple-menu');
      const hamburger = menuBtn?.querySelector('.menu-hamburger');

      const isOpen = sidebar?.classList.toggle('open');
      backdrop?.classList.toggle('open');
      menuBtn?.classList.toggle('active');

      if (hamburger) {
        hamburger.textContent = isOpen ? '✕' : '☰';
      }
    });

    // Close Sidebar on Backdrop Click
    document.getElementById('sidebar-backdrop')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.remove('open');
      document.getElementById('sidebar-backdrop')?.classList.remove('open');
      const menuBtn = document.getElementById('apple-menu');
      menuBtn?.classList.remove('active');
      const hamburger = menuBtn?.querySelector('.menu-hamburger');
      if (hamburger) hamburger.textContent = '☰';
    });

    // Close Sidebar on Nav Item Click (Delegation)
    document.querySelector('.nav-drives')?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.nav-item')) {
        document.getElementById('sidebar')?.classList.remove('open');
        document.getElementById('sidebar-backdrop')?.classList.remove('open');
        const menuBtn = document.getElementById('apple-menu');
        menuBtn?.classList.remove('active');
        const hamburger = menuBtn?.querySelector('.menu-hamburger');
        if (hamburger) hamburger.textContent = '☰';
      }
    });
  }

  private startClock(): void {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const clockElement = document.getElementById('clock');
      if (clockElement) {
        clockElement.textContent = `${hours}:${minutes}`;
      }
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  private updateThemeIcon(): void {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const theme = store.theme.get();
      themeToggle.textContent = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🌗';
    }
  }

  private updateBreadcrumb(route: Route): void {
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = route.breadcrumb.map((item, index) => {
        if (index < route.breadcrumb.length - 1) {
          return `<span>${item}</span><span class="separator">›</span>`;
        }
        return `<span class="current">${item}</span>`;
      }).join('');
    }
  }

  private updateActiveNavItem(path: string): void {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-path') === path);
    });
    document.querySelectorAll('.dock-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-path') === path);
    });
  }

  private openSearch(): void {
    const modal = document.getElementById('search-modal');
    modal?.classList.add('open');
    store.searchOpen.set(true);
    (document.getElementById('search-input') as HTMLInputElement)?.focus();
  }

  private closeSearch(): void {
    const modal = document.getElementById('search-modal');
    modal?.classList.remove('open');
    store.searchOpen.set(false);
  }

  private toggleSearch(): void {
    if (store.searchOpen.get()) {
      this.closeSearch();
    } else {
      this.openSearch();
    }
  }

  private performSearch(query: string): void {
    const results = document.getElementById('search-results');
    if (!results) return;

    if (!query.trim()) {
      results.innerHTML = '<div class="search-hint">Type to search pages, skills, projects...</div>';
      return;
    }

    const matchingRoutes = routes.filter(route =>
      route.name.toLowerCase().includes(query.toLowerCase()) ||
      route.path.toLowerCase().includes(query.toLowerCase()) ||
      route.drive.toLowerCase().includes(query.toLowerCase())
    );

    if (matchingRoutes.length === 0) {
      results.innerHTML = '<div class="no-results">No results found</div>';
      return;
    }

    results.innerHTML = matchingRoutes.map(route => `
      <a href="#${route.path}" class="search-result" onclick="document.getElementById('search-modal').classList.remove('open')">
        <span class="result-icon">${route.icon}</span>
        <div class="result-info">
          <span class="result-name">${route.name}</span>
          <span class="result-path">${route.path}</span>
        </div>
        <span class="result-drive">${route.drive}</span>
      </a>
    `).join('');
  }

  private openAIChat(): void {
    const modal = document.getElementById('ai-modal');
    modal?.classList.add('open');
    store.aiChatOpen.set(true);
  }

  private closeAIChat(): void {
    const modal = document.getElementById('ai-modal');
    modal?.classList.remove('open');
    store.aiChatOpen.set(false);
  }

  private async handleAISubmit(e: Event): Promise<void> {
    e.preventDefault();
    const input = document.getElementById('ai-input') as HTMLInputElement;
    const messages = document.getElementById('ai-messages');

    if (!input || !messages || !input.value.trim()) return;

    const userMessage = input.value.trim();
    input.value = '';

    // Add user message
    messages.innerHTML += `
      <div class="ai-message user">
        <p>${userMessage}</p>
      </div>
    `;

    // Add loading indicator
    messages.innerHTML += `
      <div class="ai-message bot loading" id="ai-loading">
        <p>Thinking...</p>
      </div>
    `;
    messages.scrollTop = messages.scrollHeight;

    try {
      // Use Puter.js AI if available
      if (typeof puter !== 'undefined' && puter.ai) {
        const response = await puter.ai.chat(
          `You are Chirag Singhal's AI assistant on his portfolio website. Answer questions about his background based on this info:

          Name: ${CONFIG.user.name}
          Position: Software Engineer, Backend & GenAI Specialist
          Location: Bhubaneswar, India
          Experience: TCS (current), QRsay (2023-2025)
          Education: B.Tech CSE from AKTU (8.81 CGPA, College Topper), JEE Advanced AIR 11870
          Skills: Python, TypeScript, FastAPI, LangChain, LangGraph, AWS, Docker, Kubernetes
          Projects: NexusAI (Multi-Agent RAG), TubeDigest (Sponsor Detection), Olivia (Voice Assistant)

          User question: ${userMessage}

          Keep responses concise and friendly. If asked something not in this info, say you don't have that information.`,
          { model: 'gpt-5-nano' }
        );

        // Remove loading and add response
        document.getElementById('ai-loading')?.remove();
        messages.innerHTML += `
          <div class="ai-message bot">
            <p>${typeof response === 'string' ? response : response.message?.content || 'Thanks for your question!'}</p>
          </div>
        `;
      } else {
        // Fallback response
        document.getElementById('ai-loading')?.remove();
        messages.innerHTML += `
          <div class="ai-message bot">
            <p>AI is currently unavailable. Please check back later or contact Chirag directly at ${CONFIG.user.email}!</p>
          </div>
        `;
      }
    } catch (error) {
      document.getElementById('ai-loading')?.remove();
      messages.innerHTML += `
        <div class="ai-message bot error">
          <p>Sorry, I encountered an error. Please try again!</p>
        </div>
      `;
    }

    messages.scrollTop = messages.scrollHeight;
  }
}

// Declare puter global for TypeScript
declare const puter: {
  ai?: {
    chat: (prompt: string, options?: { model?: string }) => Promise<string | { message?: { content: string } }>;
  };
};

export default Shell;
