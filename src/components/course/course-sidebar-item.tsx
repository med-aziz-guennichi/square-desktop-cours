import { cn } from '@/lib/utils';
import { CheckCircle, PlayCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function CourseSidebarItem({
  id,
  label,
  isCompleted,
}: {
  id: string;
  label: string;
  isCompleted: boolean;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = pathname.includes(id);
  const Icon = isCompleted ? CheckCircle : PlayCircle;
  return (
    <>
      <button
        onClick={() => navigate(`chapitre/${id}`)}
        disabled={isActive}
        type="button"
        className={cn(
          'flex items-center gap-x-2 text-muted-foreground text-sm font-medium pl-6 transition-all hover:bg-muted/50 hover:text-foreground',
          isActive &&
            'bg-primary text-foreground hover:bg-primary hover:text-foreground',
          isCompleted && 'text-primary hover:text-primary',
          isCompleted && isActive && 'bg-primary/10',
        )}
      >
        <div className="flex items-center gap-x-2 py-4">
          <Icon
            size={22}
            className={cn(
              'text-slate-500',
              isActive && 'text-foreground',
              isCompleted && 'text-emerald-700',
            )}
          />
          {label}
        </div>
        <div
          className={cn(
            'ml-auto opacity-0 border-2 border-slate-700 h-full transition-all',
            isActive && 'opacity-100',
            isCompleted && 'border-emerald-700',
          )}
        ></div>
      </button>
    </>
  );
}
