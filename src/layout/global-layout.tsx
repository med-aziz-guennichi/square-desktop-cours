import FullPageLoader from '@/components/full-page-loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { checkForUpdates } from '@/lib/updater';
import { useEffect, useState } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

declare global {
  interface Window {
    __TAURI__?: unknown;
  }
}

export default function GlobalLayout() {
  const navigation = useNavigation();
  const [updateStatus, setUpdateStatus] = useState<string>(''); // Track update status
  const [downloadProgress, setDownloadProgress] = useState<number>(0); // Track download progress
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal visibility state
  const [isDownloading, setIsDownloading] = useState<boolean>(false); // Whether download is happening or not

  const isLoading =
    navigation.state === 'loading' || navigation.state === 'submitting';

  useEffect(() => {
    checkForUpdates(
      setUpdateStatus,
      setDownloadProgress,
      setIsModalOpen,
      setIsDownloading,
    );
  }, []);

  return (
    <>
      {isLoading && <FullPageLoader isLoading={isLoading} />}
      <Outlet />

      {/* Modal for update progress */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-6 bg-white rounded-lg shadow-lg max-w-sm mx-auto">
          <DialogTitle className="text-xl font-semibold mb-2">
            Update Progress
          </DialogTitle>
          <DialogDescription>
            <p className="mb-4">{updateStatus}</p>
            {/* Progress Bar */}
            <Progress value={downloadProgress} max={100} className="mb-4" />
            <p className="text-center">{downloadProgress}%</p>
            {isDownloading && (
              <p className="mt-4 text-center">Downloading update...</p>
            )}
            <Button onClick={() => setIsModalOpen(false)} className="mt-6 w-full">
              Close
            </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
