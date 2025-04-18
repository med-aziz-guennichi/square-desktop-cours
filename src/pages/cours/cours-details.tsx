import { getChapter } from "@/apis/lesson/query-slice";
import { CourseContent } from "@/components/course/course-content";
import CourseDetailsSkeleton from "@/components/course/course-details-skeleton";
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom";

export default function CoursDetailsPage() {
    const { chapitreId } = useParams();
    const { data, isLoading } = useQuery({
        queryKey: ['chapter', chapitreId],
        queryFn: () => getChapter(chapitreId!),
        enabled: !!chapitreId,
    });
    if (isLoading) return <CourseDetailsSkeleton />
    return (
        <div className="container mx-auto">
            Hello
            {
                isLoading ? (
                    <CourseDetailsSkeleton />
                ) : (
                    <div className="p-4">
                        <h1 className="text-2xl font-bold">{data?.title}</h1>
                        <p className="mt-4 text-muted-foreground">{data?.description}</p>
                        <CourseContent data={data} />
                    </div>
                )
            }
        </div>
    )
}