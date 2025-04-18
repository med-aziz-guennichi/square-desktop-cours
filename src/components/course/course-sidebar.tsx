import { Cours } from "@/types/cours.interface";
import { CourseProgress } from "./course-progress";
import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarProps {
    course: Cours;
    progressCount: number;
}
export const CourseSidebar = async ({
    course,
    progressCount,
}: CourseSidebarProps) => {
    console.log("course", course);
    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold">{course.title}</h1>
                <div className="mt-10">
                    <CourseProgress variant="success" value={progressCount} />
                </div>
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter._id}
                        id={chapter._id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                    />
                ))}
            </div>
        </div>
    );
};