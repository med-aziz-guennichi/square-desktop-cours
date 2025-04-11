import FullPageLoader from '@/components/full-page-loader';
import { checkForUpdates } from '@/lib/updater';
import { useEffect } from 'react';

// Extend the Window interface to include __TAURI__
declare global {
  interface Window {
    __TAURI__?: unknown;
  }
}
import { Outlet, useNavigation } from 'react-router-dom';

export default function GlobalLayout() {
  const navigation = useNavigation();

  const isLoading =
    navigation.state === 'loading' || navigation.state === 'submitting';

  useEffect(() => {
    // Make sure it's only run on desktop, not in the web preview
    if (window.__TAURI__) {
      checkForUpdates();
    }
  }, []);
  return (
    <>
      {isLoading && <FullPageLoader isLoading={isLoading} />}
      <Outlet />
    </>
  );
}
