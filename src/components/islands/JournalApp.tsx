import { useEffect, useState } from 'react';
import {
  deleteJournalEntry,
  getAuthInstance,
  getOnAuthStateChanged,
  type JournalEntry,
  saveJournalEntry,
  signInWithGoogle,
  subscribeToJournalEntries,
  type User,
} from '../../lib/firebase';

export default function JournalApp() {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;
    (async () => {
      const onAuthStateChanged = await getOnAuthStateChanged();
      const auth = await getAuthInstance();
      unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
    })();
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    let unsubscribeEntries: (() => void) | undefined;
    if (user) {
      (async () => {
        unsubscribeEntries = await subscribeToJournalEntries(
          user.uid,
          (data) => {
            setEntries(data);
          },
        );
      })();
    } else {
      setEntries([]);
    }
    return () => {
      if (unsubscribeEntries) unsubscribeEntries();
    };
  }, [user]);

  const handleSave = async () => {
    if (!input.trim() || !user) return;
    const text = input.trim();
    setInput('');
    try {
      await saveJournalEntry(user.uid, user.email || 'unknown', text);
    } catch (e) {
      console.error('Failed to save journal entry', e);
      setInput(text);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteJournalEntry(id);
    } catch (e) {
      console.error('Failed to delete journal entry', e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <svg
          className="animate-spin h-8 w-8 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-strong p-12 text-center rounded-2xl flex flex-col items-center justify-center">
        <div className="h-16 w-16 mb-6 rounded-full bg-amber-500/10 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Sign in to Journal
        </h2>
        <p className="text-white/50 mb-8 max-w-sm mx-auto">
          Your journal entries will be safely synced and securely linked to your
          email address in Firestore.
        </p>
        <button onClick={signInWithGoogle} className="btn-primary">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="glass-strong p-8 mb-10">
        <h2 className="text-base font-semibold text-white mb-4">New Entry</h2>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's on your mind today?"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none transition-all mb-4"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/20">
            {input.length} characters
          </span>
          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Entry
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Entries</h2>
        <span className="text-xs text-white/30">
          {entries.length > 0 ? `${entries.length} entries` : ''}
        </span>
      </div>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center text-white/30 text-sm py-12">
            <svg
              className="h-12 w-12 mx-auto mb-3 text-white/10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            No entries yet. Start writing above.
          </div>
        ) : (
          entries.map((entry) => {
            const d = new Date(entry.createdAt);
            const dateStr = d.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            const timeStr = d.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={entry.id} className="glass p-6 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-amber-400/70">
                      {dateStr}
                    </span>
                    <span className="text-xs text-white/20">{timeStr}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-xs text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                  {entry.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
