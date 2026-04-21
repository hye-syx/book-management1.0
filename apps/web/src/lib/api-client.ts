import type { AppType } from '@book/server/api/route';
import { hc } from 'hono/client';
import { getAuthorizationHeaders } from './api-call';

/**
 * Type-safe API client using Hono RPC
 *
 * This client provides automatic type inference for all API endpoints,
 * ensuring compile-time safety for requests and responses.
 */
export const apiClient = hc<AppType>('/api/v1', {
  headers: getAuthorizationHeaders,
  init: {
    credentials: 'include', // Include cookies for authentication
  },
});
