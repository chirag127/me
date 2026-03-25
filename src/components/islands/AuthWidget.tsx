import { useState, useEffect } from 'react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, isAdmin, getOnAuthStateChanged, getAuthInstance, type User } from '../../lib/firebase';

export default function AuthWidget() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const onAuthStateChanged = await getOnAuthStateChanged();
      const auth = await getAuthInstance();
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
    })();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      setShowForm(false);
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-white/10" />
        <div className="h-4 w-20 rounded bg-white/10" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full" />
          ) : (
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
              {(user.displayName || user.email || '?')[0].toUpperCase()}
            </div>
          )}
          <span className="text-sm text-white/80">
            {user.displayName || user.email?.split('@')[0]}
          </span>
          {isAdmin(user) && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              ADMIN
            </span>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="px-3 py-2 text-sm text-white/50 hover:text-white/80 rounded-lg hover:bg-white/5 transition-all"
        >
          Sign Out
        </button>
        {isAdmin(user) && (
          <a
            href="/system/admin"
            className="px-3 py-2 text-sm text-amber-400 hover:text-amber-300 rounded-lg hover:bg-amber-500/10 transition-all border border-amber-500/30"
          >
            Admin
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Sign In
      </button>

      {showForm && (
        <div className="absolute right-0 top-full mt-2 w-80 p-4 rounded-2xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50">
          <h3 className="text-lg font-semibold text-white mb-4">Welcome to Chirag Singhal</h3>

          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all mb-4"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-3 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>

          <button
            onClick={() => setShowForm(false)}
            className="absolute top-3 right-3 p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
