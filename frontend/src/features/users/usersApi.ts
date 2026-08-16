import { apiRequest } from '../../shared/api/client';
import type { AuthUser } from '../../shared/types';

export function updateMe(
  accessToken: string,
  payload: { firstName?: string; lastName?: string; avatar?: string | null },
) {
  return apiRequest<AuthUser>(
    '/users/me',
    { method: 'PATCH', body: JSON.stringify(payload) },
    accessToken,
  );
}

export function changePassword(
  accessToken: string,
  payload: { currentPassword: string; newPassword: string },
) {
  return apiRequest<{ success: boolean }>(
    '/users/me/password',
    { method: 'PATCH', body: JSON.stringify(payload) },
    accessToken,
  );
}
