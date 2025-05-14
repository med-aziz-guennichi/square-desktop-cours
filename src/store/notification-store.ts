import { instance } from '@/lib/axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  name: string;
  description: string;
  body?: string;
  createdAt: string;
  type: 'invitation' | 'comment' | 'react' | 'chat' | 'meet' | 'system' | 'alert';
  read: boolean;
  status?: 'read' | 'unread';
  screen?: string;
  image?: string;
  fromUser?: {
    _id: string;
    username: string;
    avatar?: string;
  };
  metadata?: {
    meetingId?: string;
    meetingTitle?: string;
    meetingTime?: string;
    meetingDuration?: string;
    sender?: {
      name: string;
      avatar: string;
    };
  };
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  fetchInitialNotifications: () => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,

      // Fetch notifications from backend
      fetchInitialNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await instance.get('/get-all-notif');
          const backendNotifications: Notification[] = response.data.map(
            (n: {
              _id: string;
              title: string;
              name: string;
              body: string;
              createdAt: string;
              type?: string;
              status?: string;
              screen?: string;
              image?: string;
              fromUser?: {
                _id: string;
                username: string;
                avatar?: string;
              };
            }) => ({
              id: n._id,
              title: n.title,
              name: n.name,
              description: n.body,
              body: n.body,
              createdAt: n.createdAt,
              type: n.type || 'system',
              read: n.status === 'read',
              status: n.status,
              screen: n.screen,
              image: n.image,
              fromUser: n.fromUser,
            }),
          );

          set({
            notifications: backendNotifications,
            unreadCount: backendNotifications.filter((n) => !n.read).length,
            isLoading: false,
          });
        } catch (err) {
          set({
            error: 'Failed to load notifications',
            isLoading: false,
          });
          console.error('Notification fetch error:', err);
        }
      },

      addNotification: (notification) => {
        // Prevent duplicates
        if (get().notifications.some((n) => n.id === notification.id)) return;

        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
        }));
      },

      markAsRead: async (id) => {
        // Optimistic update
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true, status: 'read' } : n,
          ),
          unreadCount:
            state.notifications.filter((n) => n.id === id && !n.read).length > 0
              ? state.unreadCount - 1
              : state.unreadCount,
        }));

        // Sync with backend
        try {
          await instance.patch(`/update-notif/${id}`, {
            status: 'read',
          });
        } catch (err) {
          console.error('Failed to mark notification as read:', err);
        }
      },

      markAllAsRead: async () => {
        // Optimistic update
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
            status: 'read',
          })),
          unreadCount: 0,
        }));

        // Sync with backend
        try {
          await instance.patch('/mark-all-read');
        } catch (err) {
          console.error('Failed to mark all notifications as read:', err);
        }
      },

      removeNotification: async (id) => {
        const notificationToRemove = get().notifications.find((n) => n.id === id);

        // Optimistic update
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount:
            notificationToRemove && !notificationToRemove.read
              ? state.unreadCount - 1
              : state.unreadCount,
        }));

        // Sync with backend
        try {
          await instance.delete(`/delete-notif/${id}`);
        } catch (err) {
          console.error('Failed to delete notification:', err);
        }
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: 'notifications',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    },
  ),
);
