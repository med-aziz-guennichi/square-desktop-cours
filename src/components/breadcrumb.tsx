import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useSafeNavigation } from '@/hooks/use-save-navigation';
import { Home } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionConfirmationDialog } from './save-navigation-dialog';

export const Breadcrumb = () => {
  const navigate = useNavigate();
  const { sousPages } = useBreadcrumb();
  const { showConfirm, attemptAction, executePendingAction, cancelAction } =
    useSafeNavigation();
  return (
    <div>
      <BreadcrumbComponent className="flex">
        <BreadcrumbList>
          {/* Home link */}
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate('/ceo')}
              className="inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Home size={16} strokeWidth={2} />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* Pages */}
          {sousPages.map((page, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {index === sousPages.length - 1 ? (
                  <BreadcrumbPage className="inline-flex items-center gap-1.5 capitalize cursor-pointer max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {page.icon}
                    {page.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => {
                      const action = () => {
                        if (typeof page.link === 'string') {
                          navigate(page.link);
                        } else {
                          page.link();
                        }
                      };
                      attemptAction(action);
                    }}
                    className="inline-flex items-center gap-1.5 capitalize cursor-pointer"
                  >
                    {page.icon}
                    {page.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < sousPages.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </BreadcrumbComponent>
      <ActionConfirmationDialog
        open={showConfirm}
        onConfirm={executePendingAction}
        onCancel={cancelAction}
      />
    </div>
  );
};
