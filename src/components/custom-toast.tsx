"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, Users, Video } from "lucide-react"

interface Sender {
    name: string
    avatar: string
    title?: string
}

interface CustomToastProps {
    sender: Sender
    meetingTitle: string
    meetingTime: string
    meetingDuration?: string
    onJoin: () => void
    onDecline: () => void
}

export function CustomToast({
    sender,
    meetingTitle,
    meetingTime,
    meetingDuration = "30 minutes",
    onJoin,
    onDecline,
}: CustomToastProps) {
    return (
        <div className="meeting-toast-container w-full max-w-sm">
            <div className="border-l-4 border-l-emerald-500 shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-950">
                {/* Header */}
                <div className="pb-2 pt-4 px-4">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Avatar className="h-10 w-10 border-2 border-white">
                                <AvatarImage src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
                                <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{sender.name}</p>
                            {sender.title && <p className="text-xs text-muted-foreground">{sender.title}</p>}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 py-2">
                    <div className="space-y-2">
                        <h3 className="font-semibold">{meetingTitle}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>{meetingTime}</span>
                            {meetingDuration && (
                                <>
                                    <span className="mx-1">•</span>
                                    <span>{meetingDuration}</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Video className="mr-1 h-4 w-4" />
                            <span>Video Meeting</span>
                            <span className="mx-1">•</span>
                            <Users className="mr-1 h-4 w-4" />
                            <span>1-on-1</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-b-lg flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={onDecline}>
                        Decline
                    </Button>
                    <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={onJoin}>
                        Join Now
                    </Button>
                </div>
            </div>
        </div>
    )
}
