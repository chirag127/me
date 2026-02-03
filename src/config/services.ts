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
    firebase,
    engagement,
    communication
};
