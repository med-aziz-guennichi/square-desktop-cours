import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export const handleJoinMeeting = async () => {
  const sec = WebviewWindow.getByLabel('reunions');
  sec
    .then(async (window) => {
      await window?.show();
      await window?.setFocus();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
