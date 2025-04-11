import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

export default function ClassCardSkeleton() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/15 hover:cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Skeleton className="h-7 w-3/5" />
          <div className="flex space-x-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Instructors Section */}
        <div className="mb-4">
          <Skeleton className="h-3 w-20 mb-2" />
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
              <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
              <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
            </div>
            <div className="ml-2">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* Period and Students */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div>
            <Skeleton className="h-3 w-16 mb-1" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>

        {/* Gender Distribution */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex justify-between mt-1">
            <div className="flex items-center gap-1">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground/50" />
          <Skeleton className="h-4 w-40" />
        </div>
      </CardFooter>
    </Card>
  );
}
