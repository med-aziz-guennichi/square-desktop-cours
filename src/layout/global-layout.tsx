import FullPageLoader from '@/components/full-page-loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { checkForUpdates } from '@/lib/updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useEffect, useState } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

declare global {
  interface Window {
    __TAURI__?: unknown;
  }
}

export default function GlobalLayout() {
  const navigation = useNavigation();
  const isLoading =
    navigation.state === 'loading' || navigation.state === 'submitting';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdateReady, setIsUpdateReady] = useState(false);

  useEffect(() => {
    if (window.__TAURI__) {
      checkForUpdates(
        setUpdateStatus,
        setDownloadProgress,
        setIsModalOpen,
        setIsUpdateReady,
        isDownloading,
        setIsDownloading,
      );

      const interval = setInterval(
        () => {
          checkForUpdates(
            setUpdateStatus,
            setDownloadProgress,
            setIsModalOpen,
            setIsUpdateReady,
            isDownloading,
            setIsDownloading,
          );
        },
        5 * 60 * 1000,
      ); // every 5 min

      return () => clearInterval(interval);
    }
  }, [isDownloading]);

  const handleRestart = async () => {
    await relaunch();
  };

  return (
    <>
      {isLoading && <FullPageLoader isLoading={isLoading} />}
      <Outlet />

      <Dialog open={isModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>🔄 App Update</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">{updateStatus}</p>

          {!isUpdateReady && <Progress value={downloadProgress} className="mb-4" />}

          <DialogFooter>
            {isUpdateReady && (
              <Button onClick={handleRestart} className="w-full">
                Restart App
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
