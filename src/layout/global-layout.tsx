import FullPageLoader from '@/components/full-page-loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { checkForAvailableUpdate, performUpdate } from '@/lib/updater';
import { CustomContextMenu } from '@/providers/context-menu';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Outlet, useNavigation } from 'react-router-dom';


declare global {
  interface Window {
    __TAURI__?: unknown;
  }
}

export default function GlobalLayout() {
  const navigation = useNavigation();
  const [updateStatus, setUpdateStatus] = useState<string>(''); // Track update status
  const [updateFeatures, setUpdateFeatures] = useState<string>("");
  const [downloadProgress, setDownloadProgress] = useState<number>(0); // Track download progress
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Update modal
  const [isDownloading, setIsDownloading] = useState<boolean>(false); // Downloading state

  const isLoading =
    navigation.state === 'loading' || navigation.state === 'submitting';

  useEffect(() => {
    checkForAvailableUpdate().then((update) => {
      if (update) {
        setUpdateStatus(`New version ${update.version} available!`);
        setUpdateFeatures(update.body);
        setIsModalOpen(true);
      }
    });
  }, []);

  return (
    <CustomContextMenu>
      {isLoading && <FullPageLoader isLoading={isLoading} />}
      <Outlet />

      {/* Update Progress Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-6 rounded-lg shadow-lg max-w-sm mx-auto">
          <DialogTitle className="text-xl font-semibold mb-2">
            {isDownloading ? 'Updating...' : 'Update Available'}
          </DialogTitle>
          <DialogDescription>
            <p className="mb-4">{updateStatus}</p>
            <ReactMarkdown>
              {updateFeatures}
            </ReactMarkdown>

            {isDownloading ? (
              <>
                <Progress value={downloadProgress} max={100} className="mb-4" />
                <p className="text-center">{downloadProgress.toFixed(0)}%</p>
                <p className="mt-4 text-center">Downloading update...</p>
              </>
            ) : (
              <Button
                onClick={() => {
                  setIsDownloading(true);
                  performUpdate(
                    setUpdateStatus,
                    setDownloadProgress,
                    setIsDownloading,
                  );
                }}
                className="mt-4 w-full"
              >
                Update Now
              </Button>
            )}

            {!isDownloading && (
              <Button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full"
                variant="ghost"
              >
                Not Now
              </Button>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </CustomContextMenu>
  );
}
