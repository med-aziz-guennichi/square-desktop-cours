import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';

export async function checkForUpdates(
  setUpdateStatus: (status: string) => void,
  setDownloadProgress: (progress: number) => void,
  setIsModalOpen: (open: boolean) => void,
  setIsDownloading: (downloading: boolean) => void,
) {
  setUpdateStatus('Checking for updates...');
  setIsDownloading(false);
  try {
    const update = await check();
    if (update) {
      setUpdateStatus(`Found update ${update.version} - ${update.body}`);
      setIsModalOpen(true);
      let downloaded = 0;
      let contentLength = 0;
      setIsDownloading(true);

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started': {
            contentLength = event.data.contentLength!;
            setDownloadProgress(0); // Reset progress
            break;
          }
          case 'Progress': {
            downloaded += event.data.chunkLength;
            const progress = ((downloaded / contentLength) * 100).toFixed(2);
            setDownloadProgress(parseFloat(progress)); // Update progress
            break;
          }
          case 'Finished': {
            setDownloadProgress(100); // Set progress to 100%
            setUpdateStatus('Download finished!');
            break;
          }
        }
      });

      setUpdateStatus('Update installed. Relaunching app...');
      localStorage.setItem('updateJustInstalled', 'true');
      localStorage.setItem('updateNotes', update.body || 'Nothing in body.');
      await relaunch();
    } else {
      setUpdateStatus('No updates found.');
    }
  } catch (error) {
    console.error('Error while checking for updates:', error);
    setUpdateStatus('Error while checking for updates.');
  }
}
