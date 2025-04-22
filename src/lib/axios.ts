import { getRefreshToken } from '@/apis/refresh-token/query-slice';
import { useUserStore } from '@/store/user-store';
import { getVersion } from '@tauri-apps/api/app';
import axios, {
  AxiosError,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _requestId?: string;
  _isGolang?: boolean;
}

// === Request tracking ONLY for golangInstance ===
export const activeRequests = new Map<string, AbortController>();
let requestCounter = 0;

const generateRequestId = () => `req_${Date.now()}_${++requestCounter}`;

export const addActiveRequest = (config: InternalAxiosRequestConfig): CustomAxiosRequestConfig => {
  const enhancedConfig = config as CustomAxiosRequestConfig;

  // Track only if this is a golangInstance request
  if (enhancedConfig._isGolang) {
    const controller = new AbortController();
    const requestId = generateRequestId();
    enhancedConfig.signal = controller.signal;
    enhancedConfig._requestId = requestId;
    activeRequests.set(requestId, controller);
  }

  return enhancedConfig;
};

export const removeActiveRequest = (config: unknown) => {
  const typedConfig = config as CustomAxiosRequestConfig;
  if (typedConfig._isGolang && typedConfig._requestId) {
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

// === Axios instances ===
const baseConfig: CreateAxiosDefaults = {
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
};

export const instanceWithoutInterceptors = axios.create(baseConfig);
export const instance = axios.create(baseConfig);

export const golangInstance = axios.create({
  baseURL: `https://email.studiffy.com`,
});

// === Interceptors (ONLY for golangInstance) ===
golangInstance.interceptors.request.use(
  (config) => {
    const enhancedConfig = { ...config, _isGolang: true };
    return addActiveRequest(enhancedConfig);
  },
  (error) => Promise.reject(error)
);

golangInstance.interceptors.response.use(
  (response) => {
    removeActiveRequest(response.config);
    return response;
  },
  (error: AxiosError) => {
    if (!axios.isCancel(error) && (error as AxiosError).config) {
      removeActiveRequest((error as AxiosError).config);
    }
    return Promise.reject(error);
  }
);

// === instance (with auth refresh logic, no tracking) ===
instance.interceptors.request.use(
  (config) => {
    const accessToken = useUserStore.getState().user?.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

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
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          toast.error('Votre session a expiré. Veuillez vous reconnecter.');
          useUserStore.getState().removeCredentials();
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// === Status/Utility functions (same names) ===
export const getRequestStatus = () => ({
  isRequestInProgress: isRequestInProgress(),
  activeRequests: activeRequests.size,
  cancelAllRequests,
});

export const isCancelledError = (error: unknown) => {
  return axios.isCancel(error) || (error instanceof Error && error.message === 'Request cancelled');
};
