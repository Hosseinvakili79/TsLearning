import { useAppSelector } from '../../app/hooks';

export function useAccessToken() {
  return useAppSelector((state) => state.auth.tokens?.accessToken ?? null);
}
