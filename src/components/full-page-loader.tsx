import { useEffect, useRef } from 'react';
import { useNavigation } from 'react-router-dom';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';

export default function FullPageLoader({ isLoading }: { isLoading?: boolean }) {
  const navigation = useNavigation();
  const ref = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (isLoading) {
      ref.current?.continuousStart();
    }

    if (navigation.state === 'idle') {
      ref.current?.complete();
    }
  }, [navigation.state, isLoading]);
  return (
    <>
      <LoadingBar
        ref={ref}
        color="#aa46d1"
        shadow={false}
        height={5}
        transitionTime={100}
        waitingTime={300}
      />
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-violet-500"></div>
      </div>
    </>
  );
}
