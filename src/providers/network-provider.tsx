import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
        const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

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
          toast.success('You are now back online!');
        } else {
          toast.warning('You are now offline. Some features may not work.');
        }
      }
    };

    // Start interval to ping every 5 seconds
    const interval = setInterval(checkConnection, 5000);
    checkConnection(); // run on mount

    return () => clearInterval(interval);
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isOnline }}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export const useNetworkStatusContext = () => useContext(NetworkStatusContext);
