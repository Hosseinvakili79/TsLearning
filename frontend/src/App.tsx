import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './app/layout/AppShell';
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from './app/layout/ProtectedRoute';
import { useAppDispatch } from './app/hooks';
import { bootstrapAuth } from './features/auth/authSlice';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { NotificationsPage } from './features/notifications/NotificationsPage';
import { ProjectDetailPage } from './features/projects/ProjectDetailPage';
import { InvitationsPage } from './features/teams/InvitationsPage';
import { TeamDetailPage } from './features/teams/TeamDetailPage';
import { TeamsPage } from './features/teams/TeamsPage';
import { ProfilePage } from './features/users/ProfilePage';

function AppRoutes() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(bootstrapAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/:teamId" element={<TeamDetailPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/invitations" element={<InvitationsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
