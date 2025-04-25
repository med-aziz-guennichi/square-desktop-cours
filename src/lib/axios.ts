import { getRefreshToken } from '@/apis/refresh-token/query-slice';
import { useUserStore } from '@/store/user-store';
import { getVersion } from '@tauri-apps/api/app';
import axios, {
  AxiosError,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';
import { queueRetryRequest } from './retry-queue';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _requestId?: string;
  _isGolang?: boolean;
}

// === Request tracking ONLY for golangInstance ===
export const activeRequests = new Map<string, AbortController>();
let requestCounter = 0;

const generateRequestId = () => `req_${Date.now()}_${++requestCounter}`;

export const addActiveRequest = (
  config: InternalAxiosRequestConfig,
): CustomAxiosRequestConfig => {
  const enhancedConfig = config as CustomAxiosRequestConfig;

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

// === Interceptors for golangInstance ===
golangInstance.interceptors.request.use(
  (config) => {
    const enhancedConfig = { ...config, _isGolang: true };
    return addActiveRequest(enhancedConfig);
  },
  (error) => Promise.reject(error),
);

golangInstance.interceptors.response.use(
  (response) => {
    removeActiveRequest(response.config);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!axios.isCancel(error) && originalRequest) {
      removeActiveRequest(originalRequest);
    }

    // Retry on network failure
    if (!error.response && !axios.isCancel(error)) {
      queueRetryRequest(() => {
        return golangInstance(originalRequest)
          .then((res) => {
            toast.success('Reconnexion réussie, la requête a été relancée.');
            return res;
          })
          .catch(() => {
            toast.error('Échec lors de la tentative de reconnexion.');
          });
      });
    }

    return Promise.reject(error);
  },
);

// === Interceptors for instance (with auth refresh + retry) ===
instance.interceptors.request.use(
  (config) => {
    const accessToken = useUserStore.getState().user?.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Token expired (custom 498 code)
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

    // Retry on network failure
    if (!error.response && !axios.isCancel(error)) {
      queueRetryRequest(() => {
        return instance(originalRequest)
          .then((res) => {
            toast.success('Reconnexion réussie, la requête a été relancée.');
            return res;
          })
          .catch(() => {
            toast.error('Échec lors de la tentative de reconnexion.');
          });
      });
    }

    return Promise.reject(error);
  },
);

// === Utility ===
export const getRequestStatus = () => ({
  isRequestInProgress: isRequestInProgress(),
  activeRequests: activeRequests.size,
  cancelAllRequests,
});

export const isCancelledError = (error: unknown) => {
  return (
    axios.isCancel(error) ||
    (error instanceof Error && error.message === 'Request cancelled')
  );
};
