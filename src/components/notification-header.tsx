import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"
import { useNotificationsStore } from "@/store/notification-store"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export default function NotificationHeader() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsStore()

    const handleMarkAllAsRead = () => {
        markAllAsRead()
    }

    const getNotificationColor = (type: string, read: boolean) => {
        if (read) return ""
        switch (type) {
            case "meet":
                return "border-l-4 border-l-primary"
            case "invitation":
                return "border-l-4 border-l-blue-500"
            case "comment":
                return "border-l-4 border-l-green-500"
            case "react":
                return "border-l-4 border-l-yellow-500"
            case "chat":
                return "border-l-4 border-l-purple-500"
            case "alert":
                return "border-l-4 border-l-destructive"
            default:
                return "border-l-4 border-l-muted-foreground"
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9 hover:bg-muted">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[0.65rem] font-medium"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px] p-0">
                <div className="flex flex-col max-h-[calc(100vh-100px)] overflow-hidden">
                    <DropdownMenuLabel className="flex items-center justify-between sticky top-0 bg-background z-10 py-4 px-4 border-b">
                        <span className="font-semibold text-base">Notifications</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs font-medium hover:bg-muted"
                            onClick={handleMarkAllAsRead}
                        >
                            Tout marquer comme lu
                        </Button>
                    </DropdownMenuLabel>

                    <div className="overflow-y-auto max-h-[60vh] md:max-h-[400px] scrollbar-thin">
                        {notifications.length > 0 ? (
                            <div className="py-1">
                                {notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className={cn(
                                            "flex flex-col items-start p-4 cursor-pointer focus:bg-muted",
                                            !notification.read && "bg-muted/30",
                                            getNotificationColor(notification.type, notification.read),
                                        )}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex items-start justify-between w-full gap-2">
                                            <div className="font-medium text-sm">{notification.title}</div>
                                            {!notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1.5">{notification.description}</div>
                                        <div className="text-xs text-muted-foreground mt-2 font-medium">
                                            {formatDistanceToNow(new Date(notification.createdAt), {
                                                addSuffix: true,
                                                locale: fr
                                            })}
                                        </div>
                                        {notification.screen && (
                                            <div className="text-xs text-blue-500 mt-1">
                                                Cliquez pour ouvrir
                                            </div>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Aucune notification</p>
                            </div>
                        )}
                    </div>

                    <div className="sticky bottom-0 bg-background z-10 border-t">
                        <DropdownMenuItem asChild className="justify-center text-sm font-medium py-3 focus:bg-muted">
                            <NavLink to="/notifications" className="w-full text-center text-primary">
                                Voir toutes les notifications
                            </NavLink>
                        </DropdownMenuItem>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}