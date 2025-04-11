import { z } from 'zod';

export const RefreshTokenAPIRequestSchema = z.object({
  refreshToken: z.string(),
});

export const RefreshTokenAPIResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
