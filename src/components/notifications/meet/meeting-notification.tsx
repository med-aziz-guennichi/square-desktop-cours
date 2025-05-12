'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Clock, Users, Video } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from './notification-stack';

interface Sender {
  name: string;
  avatar: string;
  title?: string;
}

interface MeetingNotificationProps {
  id: string;
  sender: Sender;
  title: string;
  meetingTitle: string;
  meetingScreen?: string; // Add this line to specify the screen topi
  meetingTime: string;
  name: string;
  meetingDuration?: string;
  onJoin: (id: string) => void;
  onDecline: (id: string) => void;
  setNotifications: (notifications: NotificationItem[]) => void;
}

export function MeetingNotification({
  id,
  sender,
  meetingTitle,
  meetingTime,
  name,
  meetingDuration = '30 minutes',
  onJoin,
  onDecline,
  setNotifications,
}: MeetingNotificationProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const navigate = useNavigate();
  console.warn('name--------------------', name);
  const handleJoin = async () => {
    setIsJoining(true);
    console.warn(onJoin);
    navigate(`/dashboard/meet/${name}`);
    setNotifications([]);
  };

  const handleDecline = () => {
    setIsDeclining(true);
    onDecline(id);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-500 z-50">
      <Card
        className={cn(
          'border-l-4 border-l-emerald-500 shadow-lg meeting-notification-card',
          'border border-gray-200 dark:border-gray-700',
        )}
      >
        <CardHeader className="px-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800">
                <AvatarImage
                  src={sender.avatar || '/placeholder.svg'}
                  alt={sender.name}
                />
                <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
            </div>
            <div>
              <p className="font-medium text-sm">{sender.name}</p>
              {sender.title && (
                <p className="text-xs text-muted-foreground">{sender.title}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="">
          <div className="space-y-2">
            <h3 className="font-semibold meeting-title">{meetingTitle}</h3>
            <div className="flex items-center text-sm text-muted-foreground meeting-info">
              <Clock className="mr-1 h-4 w-4" />
              <span>{meetingTime}</span>
              {meetingDuration && (
                <>
                  <span className="mx-1">•</span>
                  <span>{meetingDuration}</span>
                </>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground meeting-info">
              <Video className="mr-1 h-4 w-4" />
              <span>Video Meeting</span>
              <span className="mx-1">•</span>
              <Users className="mr-1 h-4 w-4" />
              <span>1-on-12</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className=" rounded-b-lg flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
            disabled={isDeclining || isJoining}
          >
            {isDeclining ? 'Declining...' : 'Decline'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleJoin}
            disabled={isDeclining || isJoining}
          >
            {isJoining ? 'Joining...' : 'Join Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
