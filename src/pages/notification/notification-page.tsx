"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
    Bell,
    Calendar,
    UserPlus,
    MessageSquare,
    ThumbsUp,
    AlertTriangle,
    Info,
    CheckCheck,
    Filter,
    X,
    Check,
    ArrowLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useNotificationsStore } from "@/store/notification-store"
import { useBreadcrumb } from "@/context/BreadcrumbContext"

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationsStore()
    const { setSousPages } = useBreadcrumb();
    useEffect(() => {
        setSousPages([
            { name: 'Notifications', link: '/dashboard/notifications', icon: <Bell size={16} /> },
        ]);
    }, [setSousPages]);
    const [filter, setFilter] = useState<"all" | "unread">("all")
    const [typeFilter, setTypeFilter] = useState<string | "all">("all")
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
    const [isSelectMode, setIsSelectMode] = useState(false)

    // Filter notifications based on current filters
    const filteredNotifications = notifications
        .filter((notification) => {
            if (filter === "unread" && notification.read) return false
            if (typeFilter !== "all" && notification.type !== typeFilter) return false
            return true
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB
        })

    // Group notifications by date
    const groupedNotifications = filteredNotifications.reduce(
        (groups, notification) => {
            const date = new Date(notification.createdAt)
            const today = new Date()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            let groupKey: string

            if (date.toDateString() === today.toDateString()) {
                groupKey = "Today"
            } else if (date.toDateString() === yesterday.toDateString()) {
                groupKey = "Yesterday"
            } else {
                groupKey = date.toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
                })
            }

            if (!groups[groupKey]) {
                groups[groupKey] = []
            }

            groups[groupKey].push(notification)
            return groups
        },
        {} as Record<string, typeof filteredNotifications>,
    )
    // Handle batch actions
    const handleBatchMarkAsRead = () => {
        selectedNotifications.forEach((id) => markAsRead(id))
        setSelectedNotifications([])
        setIsSelectMode(false)
    }

    const handleBatchDismiss = () => {
        selectedNotifications.forEach((id) => removeNotification(id))
        setSelectedNotifications([])
        setIsSelectMode(false)
    }

    // Toggle select mode
    const toggleSelectMode = () => {
        setIsSelectMode(!isSelectMode)
        setSelectedNotifications([])
    }

    // Get notification icon
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

    // Get notification type label
    const getNotificationTypeLabel = (type: string) => {
        switch (type) {
            case "meet":
                return "Meeting"
            case "invitation":
                return "Invitation"
            case "comment":
                return "Comment"
            case "react":
                return "Reaction"
            case "chat":
                return "Message"
            case "alert":
                return "Alert"
            default:
                return "Notification"
        }
    }

    // Get notification type color
    const getNotificationTypeColor = (type: string) => {
        switch (type) {
            case "meet":
                return "bg-primary/10 text-primary"
            case "invitation":
                return "bg-blue-500/10 text-blue-500"
            case "comment":
                return "bg-green-500/10 text-green-500"
            case "react":
                return "bg-yellow-500/10 text-yellow-500"
            case "chat":
                return "bg-purple-500/10 text-purple-500"
            case "alert":
                return "bg-destructive/10 text-destructive"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 md:hidden"
                        onClick={() => window.history.back()}
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {unreadCount} unread
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isSelectMode ? (
                        <>
                            <Button variant="outline" size="sm" onClick={toggleSelectMode} className="hidden sm:flex">
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBatchMarkAsRead}
                                disabled={selectedNotifications.length === 0}
                            >
                                <Check className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Mark as Read</span>
                                <span className="sm:hidden">Read</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBatchDismiss}
                                disabled={selectedNotifications.length === 0}
                            >
                                <X className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Dismiss</span>
                                <span className="sm:hidden">Dismiss</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" size="sm" onClick={toggleSelectMode} className="hidden sm:flex">
                                Select
                            </Button>
                            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                                <CheckCheck className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Mark All as Read</span>
                                <span className="sm:hidden">Read All</span>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Filter Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Status</DropdownMenuLabel>
                                        <DropdownMenuItem className={filter === "all" ? "bg-muted" : ""} onClick={() => setFilter("all")}>
                                            All notifications
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={filter === "unread" ? "bg-muted" : ""}
                                            onClick={() => setFilter("unread")}
                                        >
                                            Unread only
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Type</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            className={typeFilter === "all" ? "bg-muted" : ""}
                                            onClick={() => setTypeFilter("all")}
                                        >
                                            All types
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={typeFilter === "meet" ? "bg-muted" : ""}
                                            onClick={() => setTypeFilter("meet")}
                                        >
                                            Meetings
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={typeFilter === "invitation" ? "bg-muted" : ""}
                                            onClick={() => setTypeFilter("invitation")}
                                        >
                                            Invitations
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={typeFilter === "comment" ? "bg-muted" : ""}
                                            onClick={() => setTypeFilter("comment")}
                                        >
                                            Comments
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={typeFilter === "chat" ? "bg-muted" : ""}
                                            onClick={() => setTypeFilter("chat")}
                                        >
                                            Messages
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={typeFilter === "alert" ? "bg-muted" : ""}
                                            onClick={() => setTypeFilter("alert")}
                                        >
                                            Alerts
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Sort</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            className={sortOrder === "newest" ? "bg-muted" : ""}
                                            onClick={() => setSortOrder("newest")}
                                        >
                                            Newest first
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={sortOrder === "oldest" ? "bg-muted" : ""}
                                            onClick={() => setSortOrder("oldest")}
                                        >
                                            Oldest first
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="md:w-1/3">
                    <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as "all" | "unread")}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="unread">Unread</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div className="flex gap-2 md:w-2/3">
                    <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as string | "all")}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="meet">Meetings</SelectItem>
                            <SelectItem value="invitation">Invitations</SelectItem>
                            <SelectItem value="comment">Comments</SelectItem>
                            <SelectItem value="react">Reactions</SelectItem>
                            <SelectItem value="chat">Messages</SelectItem>
                            <SelectItem value="alert">Alerts</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest first</SelectItem>
                            <SelectItem value="oldest">Oldest first</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredNotifications.length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(groupedNotifications).map(([date, notifications]) => (
                        <div key={date}>
                            <h2 className="text-sm font-medium text-muted-foreground mb-3">{date}</h2>
                            <div className="space-y-3">
                                {notifications.map((notification) => (
                                    <Card
                                        key={notification.id}
                                        className={cn(
                                            "p-4 transition-colors hover:bg-muted/50 relative group",
                                            !notification.read && "bg-muted/30 border-l-4 border-primary",
                                            isSelectMode &&
                                            selectedNotifications.includes(notification.id) &&
                                            "ring-2 ring-primary ring-offset-2",
                                        )}
                                    >
                                        <div className="flex items-start gap-4">
                                            {isSelectMode && (
                                                <div className="pt-1">
                                                    <Checkbox
                                                        checked={selectedNotifications.includes(notification.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedNotifications([...selectedNotifications, notification.id])
                                                            } else {
                                                                setSelectedNotifications(selectedNotifications.filter((id) => id !== notification.id))
                                                            }
                                                        }}
                                                        aria-label={`Select notification: ${notification.title}`}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                                            <div
                                                className="flex-1 min-w-0"
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => {
                                                    if (!isSelectMode && !notification.read) {
                                                        markAsRead(notification.id)
                                                    } else if (isSelectMode) {
                                                        if (selectedNotifications.includes(notification.id)) {
                                                            setSelectedNotifications(selectedNotifications.filter((id) => id !== notification.id))
                                                        } else {
                                                            setSelectedNotifications([...selectedNotifications, notification.id])
                                                        }
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault()
                                                        if (!isSelectMode && !notification.read) {
                                                            markAsRead(notification.id)
                                                        } else if (isSelectMode) {
                                                            if (selectedNotifications.includes(notification.id)) {
                                                                setSelectedNotifications(selectedNotifications.filter((id) => id !== notification.id))
                                                            } else {
                                                                setSelectedNotifications([...selectedNotifications, notification.id])
                                                            }
                                                        }
                                                    }
                                                }}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                                                    <div className="font-medium">{notification.title}</div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn("text-xs font-normal", getNotificationTypeColor(notification.type))}
                                                        >
                                                            {getNotificationTypeLabel(notification.type)}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground">{notification.description}</p>
                                                {notification.screen && (
                                                    <div className="mt-2">
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="p-0 h-auto text-primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                if (!notification.read) {
                                                                    markAsRead(notification.id)
                                                                }
                                                                window.location.href = `/dashboard/${notification.screen}`
                                                            }}
                                                        >
                                                            View details
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {!isSelectMode && (
                                            <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notification.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full"
                                                        onClick={() => markAsRead(notification.id)}
                                                        aria-label="Mark as read"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-full"
                                                    onClick={() => removeNotification(notification.id)}
                                                    aria-label="Dismiss notification"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted/30 h-20 w-20 rounded-full flex items-center justify-center mb-4">
                        <Bell className="h-10 w-10 opacity-40" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No notifications found</h2>
                    <p className="text-muted-foreground max-w-md">
                        {filter === "unread"
                            ? "You've read all your notifications. Check back later for new updates."
                            : typeFilter !== "all"
                                ? `You don't have any ${getNotificationTypeLabel(typeFilter as string).toLowerCase()} notifications.`
                                : "You don't have any notifications yet. Check back later for updates."}
                    </p>
                </div>
            )}
        </div>
    )
}
