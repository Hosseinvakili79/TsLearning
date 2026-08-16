import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { Spinner } from '../../shared/ui/Spinner';

export function ProtectedRoute() {
  const { tokens, bootstrapped } = useAppSelector((state) => state.auth);

  if (!bootstrapped) {
    return <Spinner />;
  }

  if (!tokens?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { tokens, bootstrapped } = useAppSelector((state) => state.auth);

  if (!bootstrapped) {
    return <Spinner />;
  }

  if (tokens?.accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
