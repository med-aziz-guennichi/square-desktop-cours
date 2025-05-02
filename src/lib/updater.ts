import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';

let pendingUpdate: Awaited<ReturnType<typeof check>> | null = null;

export async function checkForAvailableUpdate(): Promise<{
  version: string;
  body: string;
} | null> {
  try {
    const update = await check();
    if (update) {
      pendingUpdate = update;
      return {
        version: update.version,
        body: update.body ?? '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error checking for update:', error);
    return null;
  }
}

export async function performUpdate(
  setStatus: (msg: string) => void,
  setProgress: (value: number) => void,
  setDownloading: (val: boolean) => void,
) {
  if (!pendingUpdate) {
    setStatus('No update to install.');
    return;
  }

  let downloaded = 0;
  let contentLength = 0;

  setDownloading(true);
  await pendingUpdate.downloadAndInstall((event) => {
    switch (event.event) {
      case 'Started': {
        setStatus('Starting download...');
        contentLength = event.data.contentLength ?? 0;
        break;
      }
      case 'Progress': {
        downloaded += event.data.chunkLength;
        const progress = ((downloaded / contentLength) * 100).toFixed(2);
        setProgress(parseFloat(progress));
        break;
      }
      case 'Finished': {
        setProgress(100);
        setStatus('Download complete. Relaunching...');
        break;
      }
    }
  });

  localStorage.setItem('updateJustInstalled', 'true');
  localStorage.setItem('updateNotes', pendingUpdate.body ?? 'No details.');
  await relaunch();
}
