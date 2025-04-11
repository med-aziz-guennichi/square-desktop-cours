import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';

export async function checkForUpdates() {
  try {
    const update = await check();
    if (update) {
      console.warn(
        `Found update ${update.version} from ${update.date} with notes: ${update.body}`,
      );
      let downloaded = 0;
      let contentLength = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            contentLength = event.data.contentLength!;
            console.warn(`Started downloading ${event.data.contentLength} bytes`);
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            console.warn(`Downloaded ${downloaded} from ${contentLength}`);
            break;
          case 'Finished':
            console.warn('Download finished');
            break;
        }
      });

      console.warn('Update installed. Relaunching app...');
      await relaunch();
    }
  } catch (error) {
    console.error('Error while checking for updates:', error);
  }
}
