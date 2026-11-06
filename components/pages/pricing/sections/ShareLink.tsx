'use client';

import { useState } from 'react';

// Shares the Parents page through the system share sheet, or copies its link. Never throws.
export function ShareLink({ label, text, path }: { label: string; text: string; path: string }) {
  const [message, setMessage] = useState('');
  const onClick = async () => {
    const url = `${window.location.origin}${path}`;
    setMessage('');
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: 'CognitiveBotics', text, url });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setMessage('Link copied');
        return;
      }
      setMessage(`Copy this link: ${url}`);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setMessage(`Copy this link: ${url}`);
    }
  };
  return (
    <div className="flex flex-col items-start gap-1">
      <button type="button" onClick={onClick} className="min-h-[44px] text-left font-heading text-[15px] font-bold leading-[22px] text-content-brand underline-offset-4 hover:underline focus-visible:underline lg:text-[16px]">
        {label}
      </button>
      <p role="status" aria-live="polite" className="text-[14px] leading-[20px] text-text-secondary">
        {message}
      </p>
    </div>
  );
}
