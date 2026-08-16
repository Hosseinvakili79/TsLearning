import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { logoutUser } from '../../features/auth/authSlice';
import { fa } from '../../shared/i18n/fa';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M22 19v-1a3.5 3.5 0 0 0-2.5-3.35M16.5 4.1a3 3 0 0 1 0 5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 1 1 12 0c0 3.5 1.5 5 1.5 5H4.5S6 12.5 6 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 19a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 rounded-[var(--radius)] px-2.5 py-1.5 text-sm transition-colors ${
    isActive
      ? 'bg-[var(--bg-active)] font-medium text-[var(--text)]'
      : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]'
  }`;

export function AppShell() {
  const dispatch = useAppDispatch();
  const { tokens, user } = useAppSelector((state) => state.auth);
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.email
    : '';

  return (
    <div className="flex min-h-screen bg-[var(--bg)]" dir="rtl" lang="fa">
      <aside className="sticky top-0 flex h-screen w-[240px] shrink-0 flex-col border-l border-[var(--border)] bg-[var(--bg-subtle)] px-2 py-3">
        <div className="mb-4 flex items-center gap-2 px-2.5 py-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--text)] text-[11px] font-semibold text-white">
            م
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{fa.appName}</div>
            <div className="truncate text-[11px] text-[var(--text-faint)]">
              {fa.workspace}
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-0.5">
          <NavLink to="/" end className={linkClass}>
            <IconHome />
            {fa.dashboard}
          </NavLink>
          <NavLink to="/teams" className={linkClass}>
            <IconUsers />
            {fa.teams}
          </NavLink>
          <NavLink to="/invitations" className={linkClass}>
            <IconMail />
            {fa.invitations}
          </NavLink>
          <NavLink to="/notifications" className={linkClass}>
            <IconBell />
            {fa.notifications}
          </NavLink>

          <div className="my-3 px-2.5 text-[11px] font-medium uppercase tracking-wide text-[var(--text-faint)]">
            {fa.account}
          </div>
          <NavLink to="/profile" className={linkClass}>
            <IconUser />
            {fa.profile}
          </NavLink>
        </nav>

        <div className="mt-auto space-y-2 border-t border-[var(--border)] px-1 pt-3">
          <div className="flex items-center gap-2 rounded-[var(--radius)] px-2 py-1.5">
            <Avatar name={displayName || user?.email || '?'} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{displayName}</p>
              <p className="truncate text-[11px] text-[var(--text-faint)]">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-[var(--text-muted)]"
            onClick={() => dispatch(logoutUser(tokens?.accessToken ?? null))}
          >
            {fa.logout}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-5xl px-8 py-8 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
