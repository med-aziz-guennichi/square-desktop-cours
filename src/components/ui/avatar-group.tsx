import { cn } from '@/lib/utils';
import * as React from 'react';

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AvatarGroup({ children, className, ...props }: AvatarGroupProps) {
  // Convert children to array to manipulate them
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={cn('flex -space-x-2', className)} {...props}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="relative"
          style={{ zIndex: childrenArray.length - index }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
