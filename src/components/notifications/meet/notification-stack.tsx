'use client';

import { MeetingNotification } from './meeting-notification';

export interface NotificationItem {
  id: string;
  sender: {
    name: string;
    avatar: string;
    title?: string;
  };
  name: string;
  title: string;
  meetingTitle: string;
  meetingTime: string;
  meetingDuration?: string;
  screen?: string;
}

interface NotificationStackProps {
  notifications: NotificationItem[];
  onJoin: (id: string) => void;
  onDecline: (id: string) => void;
  setNotifications: (notifications: NotificationItem[]) => void;
}

export function NotificationStack({
  notifications,
  onJoin,
  onDecline,
  setNotifications,
}: NotificationStackProps) {
  if (notifications.length === 0) return null;
  console.warn(notifications);

  // Only show the most recent notification
  const latestNotification = notifications[notifications.length - 1];
  console.warn(latestNotification);
  return (
    <MeetingNotification
      id={latestNotification.id}
      sender={latestNotification.sender}
      name={latestNotification.name}
      title={latestNotification.title}
      meetingTitle={latestNotification.meetingTitle}
      meetingScreen={latestNotification.screen}
      meetingTime={latestNotification.meetingTime}
      meetingDuration={latestNotification.meetingDuration}
      setNotifications={setNotifications}
      onJoin={onJoin}
      onDecline={onDecline}
    />
  );
}
