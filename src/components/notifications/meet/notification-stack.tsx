"use client"

import { MeetingNotification } from "./meeting-notification"

export interface NotificationItem {
    id: string
    sender: {
        name: string
        avatar: string
        title?: string
    }
    meetingTitle: string
    meetingTime: string
    meetingDuration?: string
}

interface NotificationStackProps {
    notifications: NotificationItem[]
    onJoin: (id: string) => void
    onDecline: (id: string) => void
}

export function NotificationStack({ notifications, onJoin, onDecline }: NotificationStackProps) {
    if (notifications.length === 0) return null

    // Only show the most recent notification
    const latestNotification = notifications[notifications.length - 1]

    return (
        <MeetingNotification
            id={latestNotification.id}
            sender={latestNotification.sender}
            meetingTitle={latestNotification.meetingTitle}
            meetingTime={latestNotification.meetingTime}
            meetingDuration={latestNotification.meetingDuration}
            onJoin={onJoin}
            onDecline={onDecline}
        />
    )
}
