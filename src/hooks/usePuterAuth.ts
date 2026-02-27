/**
 * usePuterAuth — Puter.js Authentication Hook
 * Tracks Puter sign-in state for non-admin users
 * @module hooks/usePuterAuth
 */

import {
    useState,
    useEffect,
    useCallback,
} from 'react';
import {
    isPuterAvailable,
    isPuterSignedIn,
    signInPuter,
    signOutPuter,
    getPuterUser,
} from '@services/journal';

export interface PuterUser {
    username: string;
    email?: string;
}

export interface PuterAuthState {
    /** Whether Puter.js SDK is loaded */
    available: boolean;
    /** Whether user is signed in via Puter */
    signedIn: boolean;
    /** Puter user info */
    user: PuterUser | null;
    /** Loading state during init */
    loading: boolean;
    /** Sign in via Puter.js */
    signIn: () => Promise<void>;
    /** Sign out of Puter.js */
    signOut: () => Promise<void>;
}

export function usePuterAuth(): PuterAuthState {
    const [available, setAvailable] =
        useState(false);
    const [signedIn, setSignedIn] =
        useState(false);
    const [user, setUser] =
        useState<PuterUser | null>(null);
    const [loading, setLoading] = useState(true);

    /* ── Init: check availability & state ── */
    useEffect(() => {
        const init = async () => {
            const avail = isPuterAvailable();
            setAvailable(avail);

            if (avail && isPuterSignedIn()) {
                setSignedIn(true);
                const u = await getPuterUser();
                setUser(u);
            }
            setLoading(false);
        };
        init();
    }, []);

    /* ── Sign in ── */
    const handleSignIn = useCallback(async () => {
        if (!isPuterAvailable()) return;
        await signInPuter();
        setSignedIn(isPuterSignedIn());
        const u = await getPuterUser();
        setUser(u);
    }, []);

    /* ── Sign out ── */
    const handleSignOut =
        useCallback(async () => {
            await signOutPuter();
            setSignedIn(false);
            setUser(null);
        }, []);

    return {
        available,
        signedIn,
        user,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
    };
}
