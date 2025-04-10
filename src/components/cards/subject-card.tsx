"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, BookOpen, GraduationCap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useNavigate } from "react-router-dom"

interface CourseCardProps {
  id: string
  title: string
  instructor: {
    name: string
    surname: string
    avatar: string
  }
  description: string
  isCourse?: boolean
  isFavorite?: boolean
  price?: number | null
  isFree?: boolean
  onShareClick?: (id: string) => void
  onFavoriteClick?: (id: string) => void
  onClick?: (id: string) => void
}

export function CourseCard({
  id,
  title,
  instructor,
  description,
  isCourse = false,
  isFavorite = false,
  price = null,
  isFree = false,
  onShareClick = () => { },
  onFavoriteClick = () => { },
  onClick = () => { },
}: CourseCardProps) {
  const navigate = useNavigate();
  return (
    <Card
      className="overflow-hidden transition-all cursor-pointer relative hover:shadow-lg hover:shadow-primary/15 hover:cursor-pointer"
      onClick={() => navigate(`/dashboard/classes/${id}/cours`)}
    >
      {/* Course indicator badge */}
      <div className="absolute top-0 left-0 bg-primary text-primary-foreground rounded-br-md px-2 py-1 text-xs font-medium flex items-center gap-1 z-10">
        <GraduationCap className="h-3 w-3" />
        <span>{isCourse ? "Cours" : "Matiere"}</span>
      </div>

      {/* Price or Free badge */}
      {(price !== null || isFree) && (
        <div
          className={`absolute top-0 right-0 ${isFree ? "bg-green-500" : "bg-primary"} text-primary-foreground rounded-bl-md px-2 py-1 text-sm font-medium z-10`}
        >
          {isFree ? "Gratuit" : `${price}€`}
        </div>
      )}

      <CardHeader className="pb-2 pt-8">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onFavoriteClick(id)
                    }}
                  >
                    {isFavorite ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onShareClick(id)
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Partager ce cours</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-9 w-9">
            {/* <Image
              src={instructor.avatar || "/placeholder.svg"}
              alt={`${instructor.name} ${instructor.surname}`}
              width={40} // Adjust as necessary
              height={40} // Adjust as necessary
              loading="lazy"
              className="rounded-full object-cover"
            /> */}
            <AvatarFallback>{`${instructor.name.charAt(0)}${instructor.surname.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {instructor.name} {instructor.surname}
            </p>
            <p className="text-xs text-muted-foreground">Enseignant</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>

      <CardFooter className="border-t pt-3 pb-3">
        <div className="flex items-center gap-2 mr-auto">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Matériel de cours</span>
        </div>
        <Button variant="ghost" size="sm">
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  )
}
