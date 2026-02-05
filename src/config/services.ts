// @ts-nocheck
/**
 * Third-Party Services Configuration
 * Consolidated configuration for all external services
 * @module config/services
 */

// ============================================================================
// ANALYTICS
// ============================================================================
export const analytics = {
    clarity: {
        projectId: 'v9yyfdb222',
        enabled: true
    },
    ga4: {
        measurementId: 'G-BPSZ007KGR',
        enabled: true
    }
};

// ============================================================================
// ERROR TRACKING
// ============================================================================
// Sentry - Free tier: 5K errors/month, 10K performance transactions
// Setup: https://sentry.io → Create project → Get DSN
export const errorTracking = {
    sentry: {
        dsn: 'https://fab5503e124c3fa5d9ce1b04fbf86b92@o4509333332164608.ingest.de.sentry.io/4510822889947216',
        environment: 'production',
        tracesSampleRate: 1.0,
        sendDefaultPii: true,
        enabled: false // DISABLED due to TypeError: Cannot add property 10.38.0, object is not extensible
    }
};

// ============================================================================
// FIREBASE
// ============================================================================
export const firebase = {
    config: {
        apiKey: "AIzaSyCx--SPWCNaIY5EJpuJ_Hk28VtrVhBo0Ng",
        authDomain: "fifth-medley-408209.firebaseapp.com",
        projectId: "fifth-medley-408209",
        storageBucket: "fifth-medley-408209.firebasestorage.app",
        messagingSenderId: "1017538017299",
        appId: "1:1017538017299:web:bd8ccb096868a6f394e7e6",
        measurementId: "G-BPSZ007KGR"
    },
    enabled: true,
    features: {
        auth: true,
        firestore: true,
        storage: true,
        analytics: true
    }
};

// ============================================================================
// ENGAGEMENT
// ============================================================================
export const engagement = {
    giscus: {
        repo: 'chirag127/me',
        repoId: 'R_kgDOQ6Jz_Q',
        category: 'General',
        categoryId: 'DIC_kwDOQ6Jz_c4C1VQo',
        mapping: 'pathname',
        reactionsEnabled: true,
        theme: 'preferred_color_scheme',
        enabled: true
    },
    tawkto: {
        source: 'https://embed.tawk.to/6968e3ea8783b31983eb190b/1jf0rkjhp',
        enabled: true
    },
    addtoany: {
        enabled: true
    },
    novu: {
        applicationIdentifier: 'aITz1KMLnwI_',
        subscriberId: '697d94f7d4e004bf003b6452',
        socketUrl: 'wss://socket.novu.co',
        enabled: false // Disabled - requires backend setup
    },
    growthbook: {
        clientKey: 'sdk-BamkgvyjaSFKa0m6',
        apiHost: 'https://cdn.growthbook.io',
        enabled: false // Disabled - requires features setup
    },
    poptin: {
        siteKey: '90157d966c6a0',
        enabled: false // Disabled - lead capture not needed
    }
};

// ============================================================================
// COMMUNICATION
// ============================================================================
export const communication = {
    // Formspree - Free tier: 50 submissions/month
    // Setup: https://formspree.io → Create form → Get form ID
    formspree: {
        formId: '', // e.g., 'xwkgpqyz' - Get from formspree.io
        endpoint: '', // e.g., 'https://formspree.io/f/xwkgpqyz'
        enabled: false // Enable after adding form ID
    },

    // MailerLite - Free tier: 1000 subscribers, 12000 emails/month
    // Setup: https://mailerlite.com → Create form → Get embed code
    mailerlite: {
        formId: '', // Get from MailerLite embedded form
        accountId: '', // Get from MailerLite settings
        enabled: false // Enable after setup
    },

    googleForms: {
        enabled: true
    },
    emailjs: {
        serviceId: '',
        templateId: '',
        publicKey: '',
        enabled: false
    }
};

// ============================================================================
// CONSOLIDATED EXPORT
// ============================================================================
export const services = {
    analytics,
    errorTracking,
    firebase,
    engagement,
    communication
};
