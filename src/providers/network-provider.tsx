import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

type NetworkStatusContextType = {
  isOnline: boolean;
};

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  isOnline: true,
});

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.info('You are now back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are now offline! Some features may not work.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isOnline }}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export const useNetworkStatusContext = () => useContext(NetworkStatusContext);
