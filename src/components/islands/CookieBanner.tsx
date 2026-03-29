import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-lg animate-in slide-in-from-bottom-5">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          We use cookies to improve your experience and deliver personalized advertising. By continuing to use this site, you agree to our 
          <a href="/cookie-policy" className="text-[var(--color-primary)] hover:underline ml-1">Cookie Policy</a>.
        </p>
        <div className="flex shrink-0 gap-3">
          <button 
            type="button"
            onClick={acceptCookies}
            className="px-4 py-2 text-sm font-medium bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 transition-opacity"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
