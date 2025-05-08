import { AppSidebar } from '@/components/side-bar/app-sidebar';
import { SiteHeader } from '@/components/side-bar/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SocketProvider } from '@/providers/socket';
import { useUserStore } from '@/store/user-store';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  const user = useUserStore().decodedUser;
  useEffect(() => {
    const currentWindow = getCurrentWindow();
    const timer = setTimeout(async () => {
      if (
        user?.role &&
        ['student', 'instructor', 'responsable'].includes(user.role)
      ) {
        try {
          await currentWindow.setContentProtected(true);
          await currentWindow.setFocus(); // Prevent click-jacking
          await currentWindow.setShadow(true); // Enable window shadow to prevent overlay attacks
        } catch (error) {
          console.error('Security hardening failed:', error);
        }
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      currentWindow.setContentProtected(false).catch(console.error);
    };
  }, [user]);

  return (
    <SocketProvider>
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
    </SocketProvider>
  );
}
