import { apiRequest } from '../../shared/api/client';
import type { AuthTokens, AuthUser } from '../../shared/types';

export function register(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  return apiRequest<AuthTokens>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return apiRequest<AuthTokens>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function refresh(refreshToken: string) {
  return apiRequest<AuthTokens>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export function me(accessToken: string) {
  return apiRequest<AuthUser>('/auth/me', { method: 'GET' }, accessToken);
}

export async function logout(accessToken: string): Promise<void> {
  await apiRequest<{ success: boolean }>(
    '/auth/logout',
    { method: 'POST' },
    accessToken,
  );
}
