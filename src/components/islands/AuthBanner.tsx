import { useEffect } from 'react';
import { useAuthStore } from '../../lib/authStore';

export default function AuthBanner() {
  const { isFullyConnected, initialize, user, puterUser } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  // If both are connected, we don't need the reminder banner
  if (isFullyConnected) return null;

  return (
    <div className="relative overflow-hidden bg-[#0f172a] border-b border-white/5 py-2 z-[100]">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-cyan-500/5 to-indigo-500/5 animate-pulse" />
      
      <div className="relative max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-[11px] md:text-xs">
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${puterUser ? 'bg-cyan-400' : 'bg-white/20 animate-pulse'}`} />
          <span className="text-white/40 uppercase tracking-widest font-bold">Puter.js</span>
          <span className="text-white/80">AI Processing & Models</span>
        </div>
        
        <div className="h-4 w-px bg-white/10 hidden md:block" />
        
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${user ? 'bg-indigo-400' : 'bg-white/20 animate-pulse'}`} />
          <span className="text-white/40 uppercase tracking-widest font-bold">Google Login</span>
          <span className="text-white/80">Secure Data Storage</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 italic">
          Both required for full persistence
        </div>
      </div>
    </div>
  );
}
