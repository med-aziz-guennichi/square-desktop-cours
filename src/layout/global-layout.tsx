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
import { CustomContextMenu } from '@/providers/context-menu';
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Update modal
  const [isDownloading, setIsDownloading] = useState<boolean>(false); // Downloading state
  const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState<boolean>(false); // Success modal
  const [updateNotes, setUpdateNotes] = useState<string | null>(null);

  const isLoading =
    navigation.state === 'loading' || navigation.state === 'submitting';

  useEffect(() => {
    // Check for updates on launch
    checkForUpdates(
      setUpdateStatus,
      setDownloadProgress,
      setIsModalOpen,
      setIsDownloading,
    );
  }, []);

  useEffect(() => {
    const justUpdated = localStorage.getItem('updateJustInstalled');
    const notes = localStorage.getItem('updateNotes');
    if (justUpdated === 'true') {
      setShowUpdateSuccessModal(true);
      setUpdateNotes(notes); // Load notes into state
      localStorage.removeItem('updateJustInstalled');
      localStorage.removeItem('updateNotes');
    }
  }, []);

  return (
    <CustomContextMenu>
      {isLoading && <FullPageLoader isLoading={isLoading} />}
      <Outlet />

      {/* Update Progress Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-6 rounded-lg shadow-lg max-w-sm mx-auto">
          <DialogTitle className="text-xl font-semibold mb-2">
            Update Progress
          </DialogTitle>
          <DialogDescription>
            <p className="mb-4">{updateStatus}</p>
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

      {/* Post-Update Success Modal */}
      <Dialog open={showUpdateSuccessModal} onOpenChange={setShowUpdateSuccessModal}>
        <DialogContent className="p-6 rounded-lg shadow-lg max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-xl font-semibold mb-2">
            🎉 Update Successful
          </DialogTitle>
          <DialogDescription>
            <p className="mb-4">
              Your application has been successfully updated to the latest version.
            </p>
            {updateNotes && (
              <>
                <p className="text-sm text-muted-foreground mb-2">Release Notes:</p>
                <pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded">
                  {updateNotes}
                </pre>
              </>
            )}
            <Button
              onClick={() => setShowUpdateSuccessModal(false)}
              className="mt-4 w-full"
            >
              Got it
            </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </CustomContextMenu>
  );
}
