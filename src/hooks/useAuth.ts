/**
 * useAuth — Firebase Authentication Hook
 * Tracks sign-in state, provides signIn/signOut methods
 * Admin check via VITE_ADMIN_UID env var
 */

import { useState, useEffect, useCallback } from 'react';
import {
    getAuth,
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    type User,
} from 'firebase/auth';

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID ?? '';

export interface AuthState {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

    const signIn = useCallback(async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }, []);

    const signOut = useCallback(async () => {
        const auth = getAuth();
        await firebaseSignOut(auth);
    }, []);

    return {
        user,
        isAdmin: !!user && user.uid === ADMIN_UID,
        loading,
        signIn,
        signOut,
    };
}
