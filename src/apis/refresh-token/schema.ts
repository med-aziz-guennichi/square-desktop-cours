import { z } from 'zod';

export const RefreshTokenAPIRequestSchema = z.object({
  refreshToken: z.string(),
  clientVersion: z.string(),
});

export const RefreshTokenAPIResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  updateAvailable: z.boolean(),
});
