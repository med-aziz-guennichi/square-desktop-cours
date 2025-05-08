import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// Define context type
const SocketContext = createContext<typeof Socket | null>(null);

// Provider component props
type SocketProviderProps = {
  children: ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<typeof Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('https://socket.studiffy.com', {
      transports: ['websocket'],
      autoConnect: true,
    });
    newSocket.emit('join', 'studiffy');
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

// Custom hook for socket access
export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return socket;
};
