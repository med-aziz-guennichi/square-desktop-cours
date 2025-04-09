"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Users, Pencil, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AvatarGroup } from "@/components/ui/avatar-group"
import { IClasseCard } from "../classe-page"

type ClassCardProps = IClasseCard & {
    onChatClick?: () => void
    onEditClick?: (id: string) => void
    onDeleteClick?: (id: string) => void
}

export function ClassCard({
    id,
    title,
    instructors,
    period,
    students,
    coursesCount,
    onChatClick = () => { },
    onEditClick = () => { },
    onDeleteClick = () => { },
}: ClassCardProps) {
    const malePercentage = Math.round((students.genderDistribution.male / students.total) * 100)
    const femalePercentage = Math.round((students.genderDistribution.female / students.total) * 100)

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/15 hover:cursor-pointer">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <div className="flex space-x-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onEditClick(id)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Modifier la classe</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
                                        onClick={() => onDeleteClick(id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Supprimer la classe</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onChatClick}>
                                        <MessageCircle className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Discuter avec la classe</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                {/* Instructors Section */}
                <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Instructeurs</p>
                    <div className="flex items-center gap-2">
                        <AvatarGroup>
                            {instructors.map((instructor) => (
                                <TooltipProvider key={instructor.id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Avatar className="h-8 w-8 border-2 border-background">
                                                <AvatarImage src={instructor.avatar} alt={`${instructor.name} ${instructor.surname}`} />
                                                <AvatarFallback>{`${instructor.name.charAt(0)}${instructor.surname.charAt(0)}`}</AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {instructor.name} {instructor.surname}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </AvatarGroup>
                        <div className="ml-2">
                            {instructors.length > 0 && (
                                <p className="text-sm">
                                    {instructors[0].name} {instructors[0].surname}
                                    {instructors.length > 1 && ` +${instructors.length - 1}`}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Period and Students */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Période</p>
                        <p className="text-sm">
                            {period.start} - {period.end}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Étudiants</p>
                        <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">{students.total}</span>
                        </div>
                    </div>
                </div>

                {/* Gender Distribution */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-muted-foreground">Distribution par Genre</p>
                    </div>
                    <div className="flex h-2 w-full rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${malePercentage}%` }} />
                        <div className="h-full bg-secondary" style={{ width: `${femalePercentage}%` }} />
                    </div>
                    <div className="flex justify-between mt-1">
                        <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-xs">Hommes {malePercentage}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-secondary" />
                            <span className="text-xs">Femmes {femalePercentage}%</span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="border-t pt-3 pb-3">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{coursesCount} cours dans cette classe</span>
                </div>
            </CardFooter>
        </Card>
    )
}
