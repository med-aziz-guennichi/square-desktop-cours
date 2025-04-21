import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

type CustomContextMenuProps = PropsWithChildren & {
  pageSpecificItems?: React.ReactNode;
};

export function CustomContextMenu({
  children,
  pageSpecificItems,
}: CustomContextMenuProps) {
  const navigate = useNavigate();

  // Handle navigation actions
  const handleBack = () => {
    navigate(-1); // Go back in history
  };

  const handleForward = () => {
    navigate(1); // Go forward in history
  };

  const handleReload = () => {
    window.location.reload(); // Reload the page
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {/* Navigation items */}
        <ContextMenuItem inset onSelect={handleBack}>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset onSelect={handleForward}>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset onSelect={handleReload}>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Page-specific items */}
        {pageSpecificItems}
      </ContextMenuContent>
    </ContextMenu>
  );
}
