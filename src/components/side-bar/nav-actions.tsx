"use client"

import * as React from "react"
import {
    ArrowDown,
    ArrowUp,
    Bell,
    Copy,
    CornerUpLeft,
    CornerUpRight,
    FileText,
    GalleryVerticalEnd,
    LineChart,
    Link,
    MessageCircle,
    MoreHorizontal,
    Settings2,
    Trash,
    Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "../ui/mode-toggle"

const data = [
    [
        {
            label: "Customize Page",
            icon: Settings2,
        },
        {
            label: "Turn into wiki",
            icon: FileText,
        },
    ],
    [
        {
            label: "Copy Link",
            icon: Link,
        },
        {
            label: "Duplicate",
            icon: Copy,
        },
        {
            label: "Move to",
            icon: CornerUpRight,
        },
        {
            label: "Move to Trash",
            icon: Trash2,
        },
    ],
    [
        {
            label: "Undo",
            icon: CornerUpLeft,
        },
        {
            label: "View analytics",
            icon: LineChart,
        },
        {
            label: "Version History",
            icon: GalleryVerticalEnd,
        },
        {
            label: "Show delete pages",
            icon: Trash,
        },
        {
            label: "Notifications",
            icon: Bell,
        },
    ],
    [
        {
            label: "Import",
            icon: ArrowUp,
        },
        {
            label: "Export",
            icon: ArrowDown,
        },
    ],
]

export function NavActions() {
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        setIsOpen(true)
    }, [])

    return (
        <div className="flex items-center gap-2 text-sm">
            <Button variant="ghost" size="icon" className="h-7 w-7">
                <MessageCircle />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
                <Bell />
            </Button>
            <ModeToggle />
        </div>
    )
}
