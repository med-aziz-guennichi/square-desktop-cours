import { getRefreshToken } from '@/apis/refresh-token/query-slice';
import { useUserStore } from '@/store/user-store';
import { getVersion } from '@tauri-apps/api/app';
import axios, {
  AxiosError,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Request tracking with cancellation support
export const activeRequests = new Map<string, AbortController>();
let requestCounter = 0;

const generateRequestId = () => `req_${Date.now()}_${++requestCounter}`;

export const addActiveRequest = (config: InternalAxiosRequestConfig) => {
  const controller = new AbortController();
  const requestId = generateRequestId();
  config.signal = controller.signal;
  activeRequests.set(requestId, controller);
  return { ...config, _requestId: requestId };
};

export const removeActiveRequest = (config: unknown) => {
  const typedConfig = config as { _requestId?: string };
  if (typedConfig._requestId) {
    activeRequests.delete(typedConfig._requestId);
  }
};

export const cancelAllRequests = () => {
  activeRequests.forEach((controller, id) => {
    controller.abort();
    activeRequests.delete(id);
  });
};

export const isRequestInProgress = () => activeRequests.size > 0;

const baseConfig: CreateAxiosDefaults = {
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
};

export const instanceWithoutInterceptors = axios.create(baseConfig);

export const instance = axios.create(baseConfig);
export const golangInstance = axios.create({
  baseURL: `https://email.studiffy.com`,
});

// Enhanced request interceptor
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const enhancedConfig = addActiveRequest(config);
  return enhancedConfig;
};

const requestErrorInterceptor = (error: unknown) => {
  if (axios.isAxiosError(error) && error.config) {
    removeActiveRequest(error.config);
  }
  return Promise.reject(error);
};

// Enhanced response interceptor
const responseInterceptor = (response: AxiosResponse) => {
  removeActiveRequest(response.config);
  return response;
};

const responseErrorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

  if (!axios.isCancel(error)) {
    if (!(axios.isAxiosError(error) && (error as AxiosError).response?.status === 498 && originalRequest && !originalRequest._retry)) {
      removeActiveRequest(originalRequest);
    }
  }

  if (
    error.response?.status === 498 &&
    originalRequest &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    try {
      const version = await getVersion();
      const response = await getRefreshToken({
        refreshToken: useUserStore.getState().user!.refreshToken!,
        clientVersion: version,
      });

      const { accessToken, refreshToken } = response;
      useUserStore.setState({ user: { accessToken, refreshToken } });

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return instance(originalRequest);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        toast.error('Votre session a expiré. Veuillez vous reconnecter.');
        useUserStore.getState().removeCredentials();
      }
      return Promise.reject(error);
    }
  }

  if (axios.isCancel(error)) {
    return Promise.reject(new Error('Request cancelled'));
  }

  return Promise.reject(error);
};

// Apply interceptors to main instance
instance.interceptors.request.use(
  (config) => {
    const enhancedConfig = requestInterceptor(config);
    const accessToken = useUserStore.getState().user?.accessToken;
    if (accessToken) {
      enhancedConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
    return enhancedConfig;
  },
  requestErrorInterceptor
);

instance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

// Apply interceptors to golangInstance
golangInstance.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

golangInstance.interceptors.response.use(
  responseInterceptor,
  (error) => {
    if (!axios.isCancel(error) && error.config) {
      removeActiveRequest(error.config);
    }
    return Promise.reject(error);
  }
);

// Export the enhanced request tracking status
export const getRequestStatus = () => ({
  isRequestInProgress: isRequestInProgress(),
  activeRequests: activeRequests.size,
  cancelAllRequests,
});

// Utility function to check if error is from cancellation
export const isCancelledError = (error: unknown) => {
  return axios.isCancel(error) || (error instanceof Error && error.message === 'Request cancelled');
};
