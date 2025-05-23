import { API_ENDPOINT } from '@/constants/api';
import { api } from '@/lib/api';
import { z } from 'zod';
import { SignInAPIResponseSchema, SignInFormSchema } from './schema';

const SignInRequest = SignInFormSchema;

const SignInResponse = SignInAPIResponseSchema;

const signIn = api<z.infer<typeof SignInRequest>, z.infer<typeof SignInResponse>>({
  method: 'POST',
  path: API_ENDPOINT.SIGN_IN,
  requestSchema: SignInRequest,
  responseSchema: SignInResponse,
  type: 'public',
});

export const SignInAPI = {
  signIn,
};
