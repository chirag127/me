import { useEffect } from 'react';
import { useAuthStore } from '../../lib/authStore';

export default function AuthBanner() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // The banner is now integrated in-line in the Header (AuthWidget) and AI Popup.
  // We return null here to remove the floating/top-bar version.
  return null;
}
