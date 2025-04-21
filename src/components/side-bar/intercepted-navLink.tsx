// components/shared/InterceptedNavLink.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { type ReactNode, useState } from 'react';
import { activeRequests, cancelAllRequests, isRequestInProgress } from '@/lib/axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'; // Using shadcn/ui dialog

interface InterceptedNavLinkProps {
  to: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function InterceptedNavLink({
  to,
  children,
  disabled,
  className,
}: InterceptedNavLinkProps) {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (isRequestInProgress()) {
      e.preventDefault();
      setPendingNavigation(to);
      setShowDialog(true);
      return;
    }

    e.preventDefault();
    navigate(to);
  };

  const handleConfirmNavigation = () => {
    cancelAllRequests();
    setShowDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  const handleCancelNavigation = () => {
    setShowDialog(false);
    setPendingNavigation(null);
  };

  return (
    <>
      <NavLink 
        to={to} 
        onClick={handleClick} 
        aria-disabled={disabled} 
        className={className}
      >
        {children}
      </NavLink>

      <AlertDialog open={showDialog} onOpenChange={(open) => {
        if (!open) handleCancelNavigation();
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Active Requests in Progress</AlertDialogTitle>
            <AlertDialogDescription>
              There are {activeRequests.size} ongoing requests. 
              Cancelling may interrupt these operations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on Page</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNavigation}>
              Cancel Requests and Navigate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
