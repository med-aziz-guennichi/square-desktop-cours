import { Cours } from '@/types/cours.interface';
import { CourseProgress } from './course-progress';
import { CourseSidebarItem } from './course-sidebar-item';

interface CourseSidebarProps {
  course: Cours;
  progressCount: number;
}
export const CourseSidebar = ({ course, progressCount }: CourseSidebarProps) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-hidden shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold line-clamp-2 break-all">{course.title}</h1>
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
            type={chapter.type}
            isLocked={chapter.isLocked}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
          />
        ))}
      </div>
    </div>
  );
};
