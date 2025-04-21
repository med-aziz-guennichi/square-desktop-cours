// src/hooks/usePreventCapture.ts
import { useEffect } from 'react';
import { toast } from 'sonner';

export function usePreventCapture() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.key === 'p') ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4'))
      ) {
        e.preventDefault();
        toast.warning('Screenshots are disabled on this page');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
