// hooks/useSafeNavigation.ts
import { cancelAllRequests, isRequestInProgress } from '@/lib/axios';
import { useState } from 'react';

export const useSafeNavigation = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const attemptAction = (action: () => void) => {
    if (isRequestInProgress()) {
      setPendingAction(() => action);
      setShowConfirm(true);
      return false;
    }
    action();
    return true;
  };

  const executePendingAction = () => {
    setShowConfirm(false);
    cancelAllRequests();
    pendingAction?.();
    setPendingAction(null);
  };

  const cancelAction = () => {
    setShowConfirm(false);
    setPendingAction(null);
  };

  return {
    showConfirm,
    attemptAction,
    executePendingAction,
    cancelAction,
  };
};
