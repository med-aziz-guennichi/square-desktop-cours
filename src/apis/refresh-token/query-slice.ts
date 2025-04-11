import { API_ENDPOINT } from '@/constants/api';
import { api } from '@/lib/api';
import { z } from 'zod';
import {
  RefreshTokenAPIRequestSchema,
  RefreshTokenAPIResponseSchema,
} from './schema';

const RefreshTokenRequest = RefreshTokenAPIRequestSchema;

const RefreshTokenResponse = RefreshTokenAPIResponseSchema;

export const getRefreshToken = api<
  z.infer<typeof RefreshTokenRequest>,
  z.infer<typeof RefreshTokenResponse>
>({
  method: 'POST',
  path: API_ENDPOINT.REFRESH_TOKEN,
  requestSchema: RefreshTokenRequest,
  responseSchema: RefreshTokenResponse,
  type: 'public',
});
