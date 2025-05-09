// eslint-disable-file 
import { NotificationItem, NotificationStack } from "@/components/notifications/meet/notification-stack";
import { useNotificationsStore } from "@/store/notification-store";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import io, { Socket } from "socket.io-client";

// Define context type
const SocketContext = createContext<typeof Socket | null>(null)

// Provider component props
type SocketProviderProps = {
  children: ReactNode
}

interface MeetNotification {
  body: string
  fromUser: string
  image: string
  screen: string
  title: string
  type: string
  userId: string
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { addNotification, fetchInitialNotifications } = useNotificationsStore();

  // Handle joining a meeting
  const handleJoinMeeting = (id: string) => {
    // Find the notification
    const notification = notifications.find((n) => n.id === id)
    if (!notification) return

    // Navigate to the meeting screen or handle join logic
    // This depends on your application's routing/navigation
    window.open(notification.meetingTitle, "_blank")

    // Remove the notification
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Handle declining a meeting
  const handleDeclineMeeting = (id: string) => {
    // Remove the notification
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  useEffect(() => {
    fetchInitialNotifications();
    // Initialize socket connection
    const newSocket = io("https://socket.studiffy.com", {
      transports: ["websocket"],
      autoConnect: true,
    })

    newSocket.emit("join", "studiffy")
    setSocket(newSocket)

    // Handle meeting notifications
    newSocket.on("send-meet-notification", (data: MeetNotification[]) => {
      console.warn(data);
      // Map the incoming notification data to our component format
      const newNotifications = data.map((notification) => ({
        id: `socket-${notification.userId || Date.now()}`,
        sender: {
          name: notification.title,
          avatar: notification.image || "/placeholder.svg?height=80&width=80",
        },
        meetingTitle: 'Le cours va commencer - rejoignez la session',
        meetingTime: "Now", // You might want to extract this from the body or other fields
        meetingDuration: notification.body.includes("minutes")
          ? notification.body.match(/\d+ minutes/)?.[0]
          : "120 minutes",
        title: notification.title,
        description: notification.body,
        time: new Date().toISOString(), // Example timestamp
        type: ["system", "invitation", "comment", "react", "chat", "meet"].includes(notification.type)
          ? (notification.type as "system" | "invitation" | "comment" | "react" | "chat" | "meet")
          : "system",
        read: false,
        createdAt: new Date().toISOString(),
      }))
      // Add each notification to the store
      newNotifications.forEach(addNotification);
      // Add new notifications to the state
      setNotifications((prev) => [...prev, ...newNotifications])

      // Optional: Play a notification sound
      const audio = new Audio("/mixkit-correct-answer-tone-2870.wav")
      audio.play().catch((e) => console.error("Audio play failed:", e))
    })

    // Cleanup on unmount
    return () => {
      newSocket.disconnect()
    }
  }, [fetchInitialNotifications, addNotification])

  return (
    <SocketContext.Provider value={socket}>
      {children}
      <NotificationStack notifications={notifications} onJoin={handleJoinMeeting} onDecline={handleDeclineMeeting} />
    </SocketContext.Provider>
  )
}

// Custom hook for socket access
export const useSocket = () => {
  const socket = useContext(SocketContext)

  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider")
  }

  return socket
}
