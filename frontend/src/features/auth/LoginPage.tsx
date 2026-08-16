import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser } from '../../features/auth/authSlice';
import { fa } from '../../shared/i18n/fa';
import { Alert } from '../../shared/ui/Alert';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div
      className="flex min-h-screen bg-[var(--bg)]"
      dir="rtl"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="m-auto w-full max-w-[400px] px-4 page-enter">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--text)] text-sm font-semibold text-white">
            م
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{fa.login}</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{fa.appName}</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-[0_1px_2px_rgba(55,53,47,0.04)]">
          {error && <Alert>{error}</Alert>}
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <Input
              label={fa.email}
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
            />
            <Input
              label={fa.password}
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
            />
            <Button type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? fa.loading : fa.login}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
          {fa.noAccount}{' '}
          <Link className="font-medium text-[var(--accent)] hover:underline" to="/register">
            {fa.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
