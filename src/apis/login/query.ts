import { useUserStore } from '@/store/user-store';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { z } from 'zod';

import { API_ENDPOINT } from '@/constants/api';
import { instance } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SignInAPI } from './query-slice';
import { SignInAPIResponseSchema, SignInFormType } from './schema';

interface ErrorResponse {
  message: string;
}

export function useSignIn() {
  const { setCredentials } = useUserStore();
  const navigate = useNavigate();
  return useMutation<
    z.infer<typeof SignInAPIResponseSchema>,
    AxiosError<ErrorResponse>,
    SignInFormType
  >({
    mutationFn: (user) => SignInAPI.signIn(user),
    onSuccess: async (data) => {
      const { payload, message } = data;

      setCredentials({
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      });
      const response = await instance.get(API_ENDPOINT.ME, {
        headers: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      });
      useUserStore.getState().setDecodedUser(response.data);
      toast.success(message);
      navigate('/dashboard/classes');
    },
    onError: (error) => {
      const errorMessage = error.response?.data.message || `An error occurred :  ${JSON.stringify(error)}`;

      toast.error(errorMessage);
    },
  });
}
