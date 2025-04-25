'use client';

import { useDeleteLesson } from '@/apis/lesson/query-slice';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Share2, Star, Trash } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: {
    name: string;
    surname: string;
    avatar: string;
  };
  description: string;
  badge?: string;
  isFavorite?: boolean;
  price?: number | null;
  isFree?: boolean;
  onShareClick?: (id: string) => void;
  onFavoriteClick?: (id: string) => void;
  onClick?: (id: string) => void;
  badgeIcon?: React.ReactNode;
  isPreview?: boolean;
  chapters?: number;
  isInstructor?: boolean;
  subjectId?: string;
}

export function CourseCard({
  id,
  title,
  instructor,
  description,
  badge,
  isFavorite = false,
  price = null,
  isFree = false,
  isPreview = false,
  chapters,
  badgeIcon = <GraduationCap className="h-3 w-3" />,
  onShareClick = () => {},
  onFavoriteClick = () => {},
  onClick = () => {},
  isInstructor = true, // todo: to be change to false
  subjectId,
}: CourseCardProps) {
  const [open, setOpen] = useState(false);

  const { mutate: deleteLesson, isPending } = useDeleteLesson(id, subjectId!);

  const handleDeleteConfirm = () => {
    deleteLesson();
    setOpen(false);
  };

  const handleDeleteCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Card
        className={cn(
          'overflow-hidden transition-all relative h-[350px] max-h-[350px] rounded-lg shadow-md',
          isPreview
            ? 'cursor-default hover:shadow-none'
            : 'hover:cursor-pointer hover:shadow-lg hover:shadow-primary/15',
        )}
        onClick={() => onClick(id)}
      >
        {/* Course indicator badge */}
        <div className="absolute top-0 left-0 bg-primary text-primary-foreground rounded-br-md px-2 py-1 text-xs font-medium flex items-center gap-1 z-10">
          {badgeIcon}
          <span>{badge}</span>
        </div>

        {/* Price or Free badge */}
        {(price !== null || isFree) && (
          <div
            className={`absolute top-0 right-0 ${isFree ? 'bg-green-500' : 'bg-primary'} text-primary-foreground rounded-bl-md px-2 py-1 text-sm font-medium z-10`}
          >
            {isFree ? 'Gratuit' : `${price}€`}
          </div>
        )}

        <CardHeader className="pb-2 pt-8">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-medium line-clamp-1">
              {title}
            </CardTitle>
            <div className="flex space-x-1">
              {isInstructor ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled={isPreview}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Supprimez</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled={isPreview}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFavoriteClick(id);
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
                      <p>
                        {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      disabled={isPreview}
                      onClick={(e) => {
                        e.stopPropagation();
                        onShareClick(id);
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

          <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
        </CardContent>

        <CardFooter className="border-t pt-3 pb-3">
          <div className="flex items-center gap-2 mr-auto">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {chapters} Matériel de cours
            </span>
          </div>
          <Button variant="ghost" size="sm" disabled={isPreview}>
            Voir les détails
          </Button>
        </CardFooter>
      </Card>
      <ConfirmDeleteDialog
        isPending={isPending}
        open={open}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}
