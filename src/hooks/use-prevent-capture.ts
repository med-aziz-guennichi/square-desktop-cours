import { useEffect } from 'react';
import { toast } from 'sonner';

export function usePreventCapture() {
  useEffect(() => {
    // Empêcher les raccourcis de capture d'écran
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prévention des captures d'écran (code existant)
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.key === 'p') ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4'))
      ) {
        e.preventDefault();
        toast.warning("Les captures d'écran sont désactivées sur cette page");
      }

      // Prévention du copiage (Ctrl+C, Ctrl+Insert, Cmd+C)
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'Insert')) ||
        (e.metaKey && e.key === 'c')
      ) {
        e.preventDefault();
        toast.warning('Le copiage est désactivé sur cette page');
      }
    };

    // Empêcher le copiage via le menu contextuel ou les événements de copie
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.warning('Le copiage est désactivé sur cette page');
    };

    // Empêcher les opérations de couper
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.warning('Le couper est désactivé sur cette page');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCut);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCut);
    };
  }, []);
}
