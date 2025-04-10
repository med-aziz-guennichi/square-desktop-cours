import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen } from "lucide-react"

export default function SubjectCardSketlon() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer relative">
      {/* Course indicator badge skeleton */}
      <div className="absolute top-0 left-0 bg-primary/20 text-primary-foreground rounded-br-md px-2 py-1 z-10">
        <Skeleton className="h-5 w-16" />
      </div>

      {/* Price badge skeleton */}
      <div className="absolute top-0 right-0 bg-primary/20 text-primary-foreground rounded-bl-md px-2 py-1 z-10">
        <Skeleton className="h-5 w-12" />
      </div>

      <CardHeader className="pb-2 pt-8">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex space-x-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3 pb-3">
        <div className="flex items-center gap-2 mr-auto">
          <BookOpen className="h-4 w-4 text-muted-foreground/50" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  )
}
