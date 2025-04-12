import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';

export async function checkForUpdates(
  setUpdateStatus: (status: string) => void,
  setDownloadProgress: (progress: string) => void,
) {
  setUpdateStatus('Checking for updates...');
  try {
    const update = await check();
    if (update) {
      setUpdateStatus(`Found update ${update.version} - ${update.body}`);
      let downloaded = 0;
      let contentLength = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started': {
            contentLength = event.data.contentLength!;
            setDownloadProgress(
              `Started downloading ${event.data.contentLength} bytes`,
            );
            break;
          }
          case 'Progress': {
            downloaded += event.data.chunkLength;
            const progress = ((downloaded / contentLength) * 100).toFixed(2);
            setDownloadProgress(`Downloading: ${progress}%`);
            break;
          }
          case 'Finished': {
            setDownloadProgress('Download finished!');
            break;
          }
        }
      });

      setUpdateStatus('Update installed. Relaunching app...');
      await relaunch();
    } else {
      setUpdateStatus('No updates found.');
    }
  } catch (error) {
    console.error('Error while checking for updates:', error);
    setUpdateStatus(`Error while checking for updates:`);
  }
}
