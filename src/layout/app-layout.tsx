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
    const applyProtection = async () => {
      try {
        if (["student", "instructor", "responsable"].includes(user!.role!)) {
          await getCurrentWindow().setContentProtected(true);
        }
      } catch (error) {
        console.error('Failed to enable protection:', error);
      }
    };

    applyProtection();

    return () => {
      const cleanup = async () => {
        try {
          await getCurrentWindow().setContentProtected(false);
        } catch (error) {
          console.error('Failed to disable protection:', error);
        }
      };
      cleanup();
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
