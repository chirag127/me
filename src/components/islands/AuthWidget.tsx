import { useState, useEffect, useRef } from 'react';
import {
  signInWithGoogle,
  signOut as firebaseSignOut,
  isAdmin,
  getOnAuthStateChanged,
  getAuthInstance,
  initRecaptchaVerifier,
  signInWithPhone,
  clearRecaptcha,
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
  const [confirmationResult, setConfirmationResult] = useState<{ confirm: (code: string) => Promise<User | null> } | null>(null);
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
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      // 1. Firebase Sign In
      const fUser = await signInWithGoogle();
      if (fUser) setUser(fUser);

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
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Firebase Sign Out
      await firebaseSignOut();
      
      // Puter.js Sign Out
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
      const verifier = await initRecaptchaVerifier('phone-recaptcha-btn', 'invisible');
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
        resetPhoneState();
        // Puter.js Sign In
        const w = window as any;
        if (w.puter?.auth) {
          if (!w.puter.auth.isSignedIn()) {
            await w.puter.auth.signIn();
          }
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

  const resetPhoneState = () => {
    setPhoneStep('idle');
    setPhoneNumber('');
    setOtpCode('');
    setPhoneError('');
    setConfirmationResult(null);
    clearRecaptcha();
  };

  if (loading) {
    return (
      <div className="h-9 w-24 rounded-xl bg-white/5 animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 p-1 pr-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="h-7 w-7 rounded-lg object-cover" />
          ) : (
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
              {(user.displayName || user.email || '?')[0].toUpperCase()}
            </div>
          )}
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-medium text-white/90 leading-none">
              {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className={`h-1 w-1 rounded-full ${user ? 'bg-emerald-500' : 'bg-red-500'}`} title="Firebase" />
              <div className={`h-1 w-1 rounded-full ${puterUser ? 'bg-amber-500' : 'bg-red-500'}`} title="Puter.js" />
            </div>
          </div>
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-xs font-semibold text-white truncate">{user.displayName || 'User'}</p>
                <p className="text-[10px] text-white/40 truncate">{user.email}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between px-3 py-1.5 text-[10px] text-white/30 uppercase tracking-wider">
                  Status
                </div>
                <div className="px-3 py-1.5 flex items-center justify-between">
                  <span className="text-xs text-white/60">Firebase</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Connected</span>
                </div>
                <div className="px-3 py-1.5 flex items-center justify-between">
                  <span className="text-xs text-white/60">Puter.js</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    puterUser 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {puterUser ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <div className="h-px bg-white/5 my-1" />

                {isAdmin(user) && (
                  <a
                    href="/system/admin"
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin Dashboard
                  </a>
                )}

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (phoneStep === 'phone' || phoneStep === 'otp') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-sm p-6 rounded-2xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white">
              {phoneStep === 'phone' ? 'Sign in with Phone' : 'Enter Verification Code'}
            </h3>
            <button
              onClick={resetPhoneState}
              className="h-6 w-6 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {phoneStep === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 650-555-3434"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                />
              </div>
              {phoneError && <p className="text-xs text-red-400">{phoneError}</p>}
              <div id="phone-recaptcha-btn" ref={recaptchaContainerRef} className="hidden" />
              <button
                onClick={handlePhoneSignIn}
                disabled={signingIn || !phoneNumber.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all disabled:opacity-50"
              >
                {signingIn ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
                {signingIn ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </div>
          )}

          {phoneStep === 'otp' && (
            <div className="space-y-4">
              <p className="text-xs text-white/40">
                A verification code was sent to <span className="text-white/70">{phoneNumber}</span>
              </p>
              <div>
                <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Verification Code</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm tracking-[0.5em] text-center placeholder:text-white/20 placeholder:tracking-normal focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                />
              </div>
              {phoneError && <p className="text-xs text-red-400">{phoneError}</p>}
              <button
                onClick={handleVerifyOtp}
                disabled={signingIn || otpCode.length < 6}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all disabled:opacity-50"
              >
                {signingIn ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {signingIn ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              <button
                onClick={() => { setPhoneStep('phone'); setOtpCode(''); setPhoneError(''); }}
                className="w-full text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Use a different phone number
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleSignIn}
        disabled={signingIn}
        className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
      >
        {signingIn ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.08z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.84-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        {signingIn ? 'Signing In...' : 'Sign In'}
      </button>
      {PHONE_AUTH_ENABLED && (
      <button
        onClick={() => setPhoneStep('phone')}
        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all whitespace-nowrap"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Phone
      </button>
      )}
    </div>
  );
}
