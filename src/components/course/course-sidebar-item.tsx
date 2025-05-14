import { cn } from '@/lib/utils';
import { CheckCircle, ClipboardMinus, Lock, PlayCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function CourseSidebarItem({
  id,
  label,
  isCompleted,
  type,
  isLocked,
}: {
  id: string;
  label: string;
  isCompleted: boolean;
  type: string;
  isLocked: boolean;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = pathname.includes(id);
  const isDocument = type === 'Document';
  const Icon = isLocked
    ? Lock
    : isCompleted
      ? CheckCircle
      : isDocument
        ? ClipboardMinus
        : PlayCircle;

  return (
    <button
      onClick={() => !isLocked && navigate(`chapitre/${id}`)}
      disabled={isActive || isLocked}
      type="button"
      className={cn(
        'flex items-center gap-x-2 text-sm font-medium pl-6 transition-all',
        !isLocked && 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
        isActive &&
          'bg-primary text-foreground hover:bg-primary hover:text-foreground',
        isCompleted && 'text-primary hover:text-primary',
        isCompleted && isActive && 'bg-primary/10',
        isLocked && 'opacity-50 cursor-not-allowed',
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            isLocked ? 'text-slate-400' : 'text-slate-500',
            isActive && 'text-foreground',
            isCompleted && !isLocked && 'text-emerald-700',
          )}
        />
        <span className="text-left">
          {label}
          {isLocked && (
            <span className="text-xs text-muted-foreground ml-2">(Verrouillé)</span>
          )}
        </span>
      </div>
      <div
        className={cn(
          'ml-auto opacity-0 border-2 h-full transition-all',
          isActive && 'opacity-100 border-slate-700',
          isCompleted && !isLocked && 'border-emerald-700',
          isLocked && 'border-slate-400',
        )}
      ></div>
    </button>
  );
}
