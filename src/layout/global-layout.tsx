import FullPageLoader from '@/components/full-page-loader';
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
  const [downloadProgress, setDownloadProgress] = useState<string>(''); // Track download progress

  const isLoading =
    navigation.state === 'loading' || navigation.state === 'submitting';

  useEffect(() => {
    checkForUpdates(setUpdateStatus, setDownloadProgress);
  }, []);

  return (
    <>
      {isLoading && <FullPageLoader isLoading={isLoading} />}
      <div>
        {/* Display update status */}
        <p>{updateStatus}</p>
        {/* Display download progress */}
        <p>{downloadProgress}</p>
      </div>
      <Outlet />
    </>
  );
}
