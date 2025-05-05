import { FileQuestion } from 'lucide-react';
import type React from 'react';

interface NoDataFoundProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function NoDataFound({
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  icon,
  className,
}: NoDataFoundProps) {
  return (
    <div className={`w-full flex justify-center py-12 ${className}`}>
      <div className="flex flex-col items-center text-center max-w-md px-4">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          {icon || <FileQuestion className="h-6 w-6 text-muted-foreground" />}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
