/**
 * Firebase Service
 * Centralized Firebase initialization and exports
 * @module services/firebase
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { firebase as firebaseConfig } from '../config/services';

// Firebase instances
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

/**
 * Initialize Firebase
 * Call this once on app startup
 */
export function initFirebase(): FirebaseApp | null {
    if (!firebaseConfig.enabled) {
        console.log('[Firebase] Disabled in config');
        return null;
    }

    if (app) return app;

    try {
        app = initializeApp(firebaseConfig.config);

        // Initialize enabled features
        if (firebaseConfig.features.auth) {
            auth = getAuth(app);
        }

        if (firebaseConfig.features.firestore) {
            db = getFirestore(app);
        }

        if (firebaseConfig.features.storage) {
            storage = getStorage(app);
        }

        if (firebaseConfig.features.analytics && typeof window !== 'undefined') {
            analytics = getAnalytics(app);
        }

        console.log('[Firebase] Initialized successfully');
        return app;
    } catch (error) {
        console.error('[Firebase] Initialization failed:', error);
        return null;
    }
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth | null {
    if (!auth && app) {
        auth = getAuth(app);
    }
    return auth;
}

/**
 * Get Firestore instance
 */
export function getFirebaseDB(): Firestore | null {
    if (!db && app) {
        db = getFirestore(app);
    }
    return db;
}

/**
 * Get Firebase Storage instance
 */
export function getFirebaseStorage(): FirebaseStorage | null {
    if (!storage && app) {
        storage = getStorage(app);
    }
    return storage;
}

/**
 * Get Firebase Analytics instance
 */
export function getFirebaseAnalytics(): Analytics | null {
    return analytics;
}

// Export instances for direct access
export { app, auth, db, storage, analytics };
