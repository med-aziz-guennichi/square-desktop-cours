import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { flushRetryQueue } from '@/lib/retry-queue';

type NetworkStatusContextType = {
  isOnline: boolean;
};

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  isOnline: true,
});

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        await fetch('https://www.google.com/', {
          mode: 'no-cors',
          signal: controller.signal,
        });

        clearTimeout(timeout);
        updateStatus(true);
      } catch (error) {
        console.error(error);
        updateStatus(false);
      }
    };

    let previousStatus = true;
    const updateStatus = (status: boolean) => {
      if (status !== previousStatus) {
        setIsOnline(status);
        previousStatus = status;
        if (status) {
          toast.success('Vous êtes à nouveau en ligne.');
          flushRetryQueue();
        } else {
          toast.warning('Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.');
        }
      }
    };

    const interval = setInterval(checkConnection, 5000);
    checkConnection();

    return () => clearInterval(interval);
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isOnline }}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export const useNetworkStatusContext = () => useContext(NetworkStatusContext);
