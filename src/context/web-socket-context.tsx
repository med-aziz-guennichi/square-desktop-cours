// context/WebSocketContext.tsx
import WebSocketService from '@/services/web-socket-service';
import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';

const WebSocketContext = createContext<WebSocketService | null>(null);

export function WebSocketProvider({ 
  url,
  children 
}: { 
  url: string;
  children: ReactNode 
}) {
  const wsServiceRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    wsServiceRef.current = new WebSocketService();
    wsServiceRef.current.connect(url);

    return () => {
      wsServiceRef.current?.disconnect();
      wsServiceRef.current = null;
    };
  }, [url]);

  return (
    <WebSocketContext.Provider value={wsServiceRef.current}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
