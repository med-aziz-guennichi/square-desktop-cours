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
}

const baseConfig: CreateAxiosDefaults = {
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
};

export const instanceWithoutInterceptors = axios.create(baseConfig);

export const instance = axios.create(baseConfig);

instance.interceptors.request.use(
  function (config) {
    const accessToken = useUserStore.getState().user?.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest: CustomAxiosRequestConfig | undefined = error.config;

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

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return instance(originalRequest);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          toast.error('Votre session a expiré. Veuillez vous reconnecter.');
          useUserStore.getState().removeCredentials();
          return;
        }
      }
    }

    return Promise.reject(error);
  },
);
