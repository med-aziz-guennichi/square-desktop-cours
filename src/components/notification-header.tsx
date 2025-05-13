
import { useNotificationsStore } from '@/store/notification-store';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  Check,
  CheckCheck,
  MessageSquare,
  Calendar,
  UserPlus,
  ThumbsUp,
  AlertTriangle,
  X,
  Info,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function NotificationHeader() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification
  } = useNotificationsStore()

  const [isOpen, setIsOpen] = useState(false)
  // const navigate = useNavigate();
  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    markAllAsRead()
  }

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    removeNotification(id)
  }

  const handleNotificationClick = (id: string, name: string) => {
    markAsRead(id);
    setIsOpen(false);
    window.location.href = `/dashboard/meet/${name}`
    // navigate(`/dashboard/meet/${name}`, {replace: true});
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "meet":
        return <Calendar className="h-5 w-5 text-primary" />
      case "invitation":
        return <UserPlus className="h-5 w-5 text-blue-500" />
      case "comment":
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case "react":
        return <ThumbsUp className="h-5 w-5 text-yellow-500" />
      case "chat":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full h-10 w-10 hover:bg-muted transition-colors duration-200"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              >
                <Bell className="h-[1.2rem] w-[1.2rem]" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[0.65rem] font-medium animate-pulse"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-[380px] p-0 rounded-xl shadow-lg" sideOffset={8}>
        <div className="flex flex-col max-h-[calc(100vh-100px)] overflow-hidden">
          <DropdownMenuLabel className="flex items-center justify-between sticky top-0 bg-background z-10 py-4 px-4 border-b">
            <span className="font-semibold text-base">Notifications</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-medium hover:bg-muted flex items-center gap-1"
              onClick={handleMarkAllAsRead}
              aria-label="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all as read
            </Button>
          </DropdownMenuLabel>

          <div
            className="overflow-y-auto max-h-[60vh] md:max-h-[400px] scrollbar-thin"
            role="region"
            aria-label="Notification list"
          >
            {notifications.length > 0 ? (
              <div className="py-1">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      'flex items-start p-4 cursor-pointer focus:bg-muted hover:bg-muted/50 transition-colors duration-200 gap-3 relative group',
                      !notification.read && 'bg-muted/30',
                    )}
                    onClick={() => handleNotificationClick(notification.id, notification.name)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between w-full gap-2">
                        <div className={cn("font-medium text-sm", !notification.read && "text-foreground", notification.read && "text-muted-foreground")}>
                          {notification.title}
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                        )}
                      </div>
                      <div className={cn("text-sm mt-1", !notification.read ? "text-muted-foreground" : "text-muted-foreground/70")}>
                        {notification.description}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-muted-foreground font-medium">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                        {notification.screen && (
                          <div className="text-xs text-primary font-medium">
                            View details
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3"
                      onClick={(e) => handleDismiss(e, notification.id)}
                      aria-label="Dismiss notification"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute right-10 top-3"
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                        }}
                        aria-label="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-8 w-8 opacity-40" />
                </div>
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs text-muted-foreground mt-1">We&apos;ll notify you when something arrives</p>
              </div>
            )}
          </div>

          <DropdownMenuSeparator />
          <div className="sticky bottom-0 bg-background z-10">
            <DropdownMenuItem
              asChild
              className="justify-center text-sm font-medium py-3 focus:bg-muted hover:bg-muted/50 transition-colors duration-200"
            >
              <NavLink
                to="/dashboard/notifications"
                className="w-full text-center text-primary"
              >
                View all notifications
              </NavLink>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
