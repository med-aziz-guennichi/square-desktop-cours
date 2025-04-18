import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function CourseDetailsSkeleton() {
    return (
        <div className="container mx-auto">
            {/* Course Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Title and badges */}
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </div>

                    {/* Instructor info */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    {/* Short description */}
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>

                {/* Course Card */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-48 w-full rounded-md" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-1/3" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                            <Button className="w-full" disabled>
                                <Skeleton className="h-5 w-24" />
                            </Button>
                            <Button variant="outline" className="w-full" disabled>
                                <Skeleton className="h-5 w-32" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Course Content Tabs */}
            <Tabs defaultValue="overview" className="mb-8">
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">
                        <Skeleton className="h-5 w-20" />
                    </TabsTrigger>
                    <TabsTrigger value="curriculum">
                        <Skeleton className="h-5 w-24" />
                    </TabsTrigger>
                    <TabsTrigger value="reviews">
                        <Skeleton className="h-5 w-20" />
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* About this course */}
                    <div className="space-y-4">
                        <Skeleton className="h-7 w-48" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>
                    </div>

                    {/* What you'll learn */}
                    <div className="space-y-4">
                        <Skeleton className="h-7 w-48" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <Skeleton className="h-5 w-5 mt-0.5" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-4">
                        <Skeleton className="h-7 w-36" />
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <Skeleton className="h-2 w-2 rounded-full mt-2" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="curriculum" className="space-y-6">
                    {/* Course sections */}
                    <div className="space-y-6">
                        {Array.from({ length: 4 }).map((_, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                                <div className="space-y-3 pl-4">
                                    {Array.from({ length: 3 }).map((_, lectureIndex) => (
                                        <div key={lectureIndex} className="flex justify-between items-center p-3 border rounded-md">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-5 w-5" />
                                                <Skeleton className="h-5 w-40" />
                                            </div>
                                            <Skeleton className="h-5 w-16" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                    {/* Reviews summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 flex flex-col items-center justify-center space-y-2">
                            <Skeleton className="h-16 w-16" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-5 w-48" />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-5 w-24" />
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <Skeleton className={`h-2 rounded-full w-${10 - i * 2}/12`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Individual reviews */}
                    <div className="space-y-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                                <div className="space-y-2 pl-12">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Related courses */}
            <div className="space-y-6">
                <Skeleton className="h-7 w-48" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="p-0">
                                <Skeleton className="h-40 w-full rounded-t-lg" />
                            </CardHeader>
                            <CardContent className="space-y-3 pt-4">
                                <Skeleton className="h-5 w-5/6" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-5 w-16" />
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-8" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
