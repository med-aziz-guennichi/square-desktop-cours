type RetryCallback = () => void;

const pendingRequests: RetryCallback[] = [];

export const queueRetryRequest = (retry: RetryCallback) => {
  pendingRequests.push(retry);
};

export const flushRetryQueue = () => {
  if (pendingRequests.length > 0) {
    pendingRequests.forEach((retry) => retry());
    pendingRequests.length = 0;
  }
};
