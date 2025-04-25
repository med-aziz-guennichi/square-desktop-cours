import { AppSidebar } from '@/components/side-bar/app-sidebar';
import { SiteHeader } from '@/components/side-bar/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useUserStore } from '@/store/user-store';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  const user = useUserStore().decodedUser;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (['student', 'instructor', 'responsable'].includes(user!.role!)) {
        getCurrentWindow().setContentProtected(true).catch(console.error);
      }
    }, 1000); // Delay by 1 second

    return () => {
      clearTimeout(timer);
      getCurrentWindow().setContentProtected(false).catch(console.error);
    };
  }, [user]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
