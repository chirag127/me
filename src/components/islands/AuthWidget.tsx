import { useEffect, useRef, useState } from 'react';
import {
  clearRecaptcha,
  signOut as firebaseSignOut,
  getAuthInstance,
  getOnAuthStateChanged,
  initRecaptchaVerifier,
  isAdmin,
  signInWithGoogle,
  signInWithPhone,
  type User,
} from '../../lib/firebase';

const PHONE_AUTH_ENABLED = false;

export default function AuthWidget() {
  const [user, setUser] = useState<User | null>(null);
  const [puterUser, setPuterUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  // Phone auth state
  const [phoneStep, setPhoneStep] = useState<'idle' | 'phone' | 'otp'>('idle');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<{
    confirm: (code: string) => Promise<User | null>;
  } | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      // Firebase Auth
      const onAuthStateChanged = await getOnAuthStateChanged();
      const auth = await getAuthInstance();
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });

      // Puter.js Auth
      const checkPuter = async () => {
        const w = window as any;
        if (w.puter?.auth) {
          try {
            if (w.puter.auth.isSignedIn()) {
              const pUser = await w.puter.auth.getUser();
              setPuterUser({ username: pUser.username });
            }
          } catch (e) {
            console.error('Puter auth check error:', e);
          }
        }
      };

      // Wait for puter to load
      let attempts = 0;
      const interval = setInterval(() => {
        if ((window as any).puter) {
          checkPuter();
          clearInterval(interval);
        }
        if (attempts++ > 20) clearInterval(interval);
      }, 500);
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      // 1. Firebase Sign In (Redirect)
      await signInWithGoogle();
      
      // 2. Puter.js Sign In
      const w = window as any;
      if (w.puter?.auth) {
        if (!w.puter.auth.isSignedIn()) {
          await w.puter.auth.signIn();
        }
        const pUser = await w.puter.auth.getUser();
        if (pUser) setPuterUser({ username: pUser.username });
      }
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      if (typeof window !== 'undefined') setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      const w = window as any;
      if (w.puter?.auth?.isSignedIn()) {
        w.puter.auth.signOut();
      }
      setUser(null);
      setPuterUser(null);
      setShowDropdown(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handlePhoneSignIn = async () => {
    setPhoneError('');
    setSigningIn(true);
    try {
      const verifier = await initRecaptchaVerifier(
        'phone-recaptcha-btn',
        'invisible',
      );
      const result = await signInWithPhone(phoneNumber, verifier);
      if (result) {
        setConfirmationResult(result);
        setPhoneStep('otp');
      }
    } catch (err: any) {
      setPhoneError(err?.message || 'Failed to send verification code');
      await clearRecaptcha();
    } finally {
      setSigningIn(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return;
    setPhoneError('');
    setSigningIn(true);
    try {
      const fUser = await confirmationResult.confirm(otpCode);
      if (fUser) {
        setUser(fUser);
        setPhoneStep('idle');
        const w = window as any;
        if (w.puter?.auth) {
          if (!w.puter.auth.isSignedIn()) await w.puter.auth.signIn();
          const pUser = await w.puter.auth.getUser();
          if (pUser) setPuterUser({ username: pUser.username });
        }
      }
    } catch (err: any) {
      setPhoneError(err?.message || 'Invalid verification code');
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return <div className="h-9 w-24 rounded-xl bg-white/5 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 p-1 pr-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="h-7 w-7 rounded-lg object-cover"
            />
          ) : (
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
              {(user.displayName || user.email || '?')[0].toUpperCase()}
            </div>
          )}
          <div className="flex flex-col items-start px-0.5">
            <span className="text-[11px] font-bold text-white/90 leading-tight tracking-tight">
              {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-1">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${user ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'bg-red-500'}`}
                  title="Google (Firebase)"
                />
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${puterUser ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-white/10'}`}
                  title="Puter.js"
                />
              </div>
            </div>
          </div>
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-3 border-b border-white/5 mb-1 bg-white/2 rounded-t-xl">
                <p className="text-sm font-bold text-white truncate">
                  {user.displayName || 'Authorized User'}
                </p>
                <p className="text-[10px] text-white/40 truncate">
                  {user.email}
                </p>
              </div>

              <div className="p-1 space-y-1">
                <div className="flex items-center justify-between px-2 py-1.5 text-[10px] text-white/20 uppercase tracking-widest font-bold">
                  Network Status
                </div>
                
                <div className="px-3 py-2 flex items-center justify-between rounded-lg bg-white/2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-indigo-500/10 flex items-center justify-center">
                      <svg className="h-2.5 w-2.5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.08z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.84-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </div>
                    <span className="text-xs text-white/70">Google</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="px-3 py-2 flex items-center justify-between rounded-lg bg-white/2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-cyan-500/10 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    </div>
                    <span className="text-xs text-white/70">Puter.js</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${puterUser ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-white/5 text-white/20 border-white/10'}`}>
                    {puterUser ? 'ACTIVE' : 'OFFLINE'}
                  </span>
                </div>

                <div className="h-px bg-white/5 my-2" />

                {isAdmin(user) && (
                  <a
                    href="/system/admin"
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-xs text-amber-400 hover:bg-amber-400/10 rounded-xl transition-all group"
                  >
                    <div className="h-7 w-7 rounded-lg bg-amber-400/10 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="font-semibold">Admin Panel</span>
                  </a>
                )}

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-xs text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
                >
                  <div className="h-7 w-7 rounded-lg bg-red-400/10 flex items-center justify-center group-hover:bg-red-400/20 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-semibold">Disconnect Dual Login</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleSignIn}
        disabled={signingIn}
        className="group relative flex items-center gap-3 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xl shadow-indigo-600/20 border border-indigo-400/30 overflow-hidden disabled:opacity-50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {signingIn ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <div className="flex -space-x-1.5">
            <div className="h-5 w-5 rounded-md bg-white flex items-center justify-center">
              <svg className="h-3 w-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.08z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.84-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            <div className="h-5 w-5 rounded-md bg-cyan-500 flex items-center justify-center border border-white/20">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
            </div>
          </div>
        ) }
        
        <span className="text-xs font-bold uppercase tracking-widest">
          {signingIn ? 'Authenticating...' : 'Dual Login'}
        </span>
      </button>
    </div>
  );
}
