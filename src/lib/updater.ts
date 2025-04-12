import { check } from '@tauri-apps/plugin-updater';

export async function checkForUpdates(
  setUpdateStatus: (status: string) => void,
  setDownloadProgress: (progress: number) => void,
  setIsModalOpen: (open: boolean) => void,
  setIsUpdateReady: (ready: boolean) => void,
  isDownloading: boolean,
  setIsDownloading: (downloading: boolean) => void,
) {
  if (isDownloading) return;

  try {
    const update = await check();
    if (update) {
      setIsModalOpen(true);
      setUpdateStatus(`Found update: ${update.version}`);
      setIsDownloading(true);

      let downloaded = 0;
      let contentLength = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started': {
            contentLength = event.data.contentLength!;
            break;
          }
          case 'Progress': {
            downloaded += event.data.chunkLength;
            const progress = (downloaded / contentLength) * 100;
            setDownloadProgress(progress);
            break;
          }
          case 'Finished': {
            setUpdateStatus('✅ Update downloaded. Ready to restart.');
            setIsUpdateReady(true);
            break;
          }
        }
      });
    } else {
      setUpdateStatus('No updates available.');
    }
  } catch (error) {
    console.error('Update check failed:', error);
    setUpdateStatus('❌ Failed to check for updates.');
  } finally {
    setIsDownloading(false);
  }
}
