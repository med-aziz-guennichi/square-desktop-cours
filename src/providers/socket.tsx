// eslint-disable-file
import {
  NotificationItem,
  NotificationStack,
} from '@/components/notifications/meet/notification-stack';
import { useNotificationsStore } from '@/store/notification-store';
import { useUserStore } from '@/store/user-store';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import io, { Socket } from 'socket.io-client';

// Define context type
const SocketContext = createContext<typeof Socket | null>(null);

// Provider component props
type SocketProviderProps = {
  children: ReactNode;
};

interface MeetNotification {
  body: string;
  fromUser: string;
  name: string;
  image: string;
  screen: string;
  title: string;
  type: string;
  userId: string;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { addNotification, fetchInitialNotifications } = useNotificationsStore();
  const user = useUserStore().decodedUser;

  // Handle joining a meeting
  const handleJoinMeeting = () => {
    return true;
  };

  // Handle declining a meeting
  const handleDeclineMeeting = (id: string) => {
    // Remove the notification
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    fetchInitialNotifications();
    // Initialize socket connection
    const newSocket = io('https://socket.studiffy.com', {
      transports: ['websocket'],
      autoConnect: true,
    });

    newSocket.emit('join', 'studiffy');
    setSocket(newSocket);

    // Handle meeting notifications
    newSocket.on('send-meet-notification', (data: MeetNotification[]) => {
      if (!user?._id) return;

      console.warn(data);

      // Map and filter only relevant notifications
      const newNotifications = data
        .filter((notification) => notification?.userId === user._id)
        .map((notification) => ({
          id: `socket-${notification.userId || Date.now()}`,
          sender: {
            name: notification.title,
            avatar: notification.image || '/placeholder.svg?height=80&width=80',
          },
          name: notification.name,
          screen: notification.screen,
          meetingTitle: 'Le cours va commencer - rejoignez la session',
          meetingTime: 'Now',
          meetingDuration: notification.body.includes('minutes')
            ? notification.body.match(/\d+ minutes/)?.[0] || '120 minutes'
            : '120 minutes',
          title: notification.title,
          description: notification.body,
          time: new Date().toISOString(),
          type: [
            'system',
            'invitation',
            'comment',
            'react',
            'chat',
            'meet',
          ].includes(notification.type)
            ? (notification.type as
                | 'system'
                | 'invitation'
                | 'comment'
                | 'react'
                | 'chat'
                | 'meet')
            : 'system',
          read: false,
          createdAt: new Date().toISOString(),
        }));

      // Add notifications to the store and update UI state
      newNotifications.forEach(addNotification);
      setNotifications((prev) => [...prev, ...newNotifications]);

      // Optional: Play a notification sound if there are any new ones
      if (newNotifications.length > 0) {
        const audio = new Audio('/mixkit-correct-answer-tone-2870.wav');
        audio.play().catch((e) => console.error('Audio play failed:', e));
      }
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [fetchInitialNotifications, addNotification, user?._id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
      <NotificationStack
        notifications={notifications}
        onJoin={handleJoinMeeting}
        setNotifications={setNotifications}
        onDecline={handleDeclineMeeting}
      />
    </SocketContext.Provider>
  );
};

// Custom hook for socket access
export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return socket;
};
