import { useEffect, useState } from 'react';

declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: { push: (callback: { CONSENT_API_READY: () => void }) => unknown };
      showRevocationMessage?: () => void;
    };
  }
}

export function PrivacyChoices() {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => {
    let active = true;
    const googlefc = window.googlefc = window.googlefc || {};
    googlefc.callbackQueue = googlefc.callbackQueue || [];
    googlefc.callbackQueue.push({ CONSENT_API_READY: () => {
      if (active) setReady(typeof window.googlefc?.showRevocationMessage === 'function');
    }});
    return () => { active = false; };
  }, []);

  function reopen() {
    window.googlefc?.callbackQueue?.push({ CONSENT_API_READY: () => {
      try {
        window.googlefc?.showRevocationMessage?.();
        setStatus('Requested Google’s privacy choices. The message shown depends on your region.');
      } catch {
        setStatus('Google’s privacy choices could not open. Try reloading this page or use the advertising settings links below.');
      }
    }});
  }

  return <div>
    <button type="button" disabled={!ready} onClick={reopen}>Privacy and cookie settings</button>
    <p className="note">Reopen Google’s consent message to change or withdraw your choices. This control becomes available when Google’s consent service loads; availability depends on your region and browser settings.</p>
    <p role="status">{status}</p>
  </div>;
}
