// @ts-nocheck
/**
 * Third-Party Services Initialization
 * Loads and initializes all enabled external services
 * @module services/init
 */

import { analytics, engagement } from '../config/services';

/**
 * Initialize Microsoft Clarity
 * Behavior analytics with heatmaps and session recordings
 */
function initClarity(): void {
    if (!analytics.clarity.enabled || !analytics.clarity.projectId) return;

    const projectId = analytics.clarity.projectId;

    // Clarity initialization script
    (function(c: any, l: Document, a: string, r: string, i: string) {
        c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
        const t = l.createElement(r) as HTMLScriptElement;
        t.async = true;
        t.src = "https://www.clarity.ms/tag/" + i;
        const y = l.getElementsByTagName(r)[0];
        y.parentNode?.insertBefore(t, y);
    })(window, document, "clarity", "script", projectId);

    console.log('[Services] Clarity initialized');
}

/**
 * Initialize Google Analytics 4
 * Traffic and conversion analytics
 */
function initGA4(): void {
    if (!analytics.ga4.enabled || !analytics.ga4.measurementId) return;

    const measurementId = analytics.ga4.measurementId;

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', measurementId);

    console.log('[Services] GA4 initialized');
}

/**
 * Initialize Tawk.to Live Chat
 * Free live chat widget
 */
function initTawkTo(): void {
    if (!engagement.tawkto.enabled || !engagement.tawkto.source) return;

    const source = engagement.tawkto.source;

    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.async = true;
    script.src = source;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);

    console.log('[Services] Tawk.to initialized');
}

/**
 * Initialize AddToAny Social Share
 * Lightweight social sharing buttons
 */
function initAddToAny(): void {
    if (!engagement.addtoany.enabled) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://static.addtoany.com/menu/page.js';
    document.head.appendChild(script);

    console.log('[Services] AddToAny initialized');
}

/**
 * Initialize Giscus Comments
 * GitHub-based comment system
 * Call this when you want to render comments on a page
 */
export function initGiscus(container: HTMLElement): void {
    if (!engagement.giscus.enabled) return;

    const { repo, repoId, category, categoryId, mapping, reactionsEnabled, theme } = engagement.giscus;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    script.setAttribute('data-reactions-enabled', reactionsEnabled ? '1' : '0');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'en');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    container.appendChild(script);

    console.log('[Services] Giscus initialized');
}

/**
 * Create AddToAny share buttons HTML
 * Use this to add share buttons to any page
 */
export function createShareButtons(): string {
    if (!engagement.addtoany.enabled) return '';

    return `
        <div class="a2a_kit a2a_kit_size_32 a2a_default_style">
            <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
            <a class="a2a_button_twitter"></a>
            <a class="a2a_button_linkedin"></a>
            <a class="a2a_button_reddit"></a>
            <a class="a2a_button_whatsapp"></a>
            <a class="a2a_button_copy_link"></a>
        </div>
    `;
}

/**
 * Initialize all enabled services
 * Call this once on app startup
 */
export function initServices(): void {
    console.log('[Services] Initializing third-party services...');

    // Analytics (load first for tracking)
    initClarity();
    initGA4();

    // Engagement
    initTawkTo();
    initAddToAny();

    console.log('[Services] All services initialized');
}

/**
 * Track custom event in GA4
 */
export function trackEvent(eventName: string, params?: Record<string, any>): void {
    if (!analytics.ga4.enabled) return;

    const gtag = (window as any).gtag;
    if (gtag) {
        gtag('event', eventName, params);
    }
}

/**
 * Track page view in GA4
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
    if (!analytics.ga4.enabled) return;

    const gtag = (window as any).gtag;
    if (gtag) {
        gtag('config', analytics.ga4.measurementId, {
            page_path: pagePath,
            page_title: pageTitle
        });
    }
}
