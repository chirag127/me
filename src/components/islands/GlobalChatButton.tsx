import { useAIChatStore } from '../../store/useAIChatStore';

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

export default function GlobalChatButton() {
  const { toggleChat, isOpen } = useAIChatStore();

  if (isOpen) return null;

  return (
    <div className="fixed bottom-8 right-8 z-40 transform hover:-translate-y-1 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 blur-[24px] opacity-40 rounded-full animate-pulse pointer-events-none"></div>
      <button
        onClick={toggleChat}
        className="relative flex items-center justify-center gap-2.5 px-6 py-4 bg-[#1a1a2e]/90 backdrop-blur-xl text-white rounded-full font-bold shadow-2xl border border-white/20 hover:bg-[#1a1a2e] transition-colors overflow-hidden group min-w-[200px]"
      >
        <SparkleIcon className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" />
        <span className="text-sm uppercase tracking-widest text-gradient bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all">Ask AI about Chirag</span>
      </button>
    </div>
  );
}
