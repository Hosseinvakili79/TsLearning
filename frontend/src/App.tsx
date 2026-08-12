import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  fetchProfile,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from './features/auth/authSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { tokens, user, loading, error } = useAppSelector((state) => state.auth);

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const isAuthenticated = useMemo(() => Boolean(tokens?.accessToken), [tokens]);

  const onRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(registerUser(registerForm));
    if (registerUser.fulfilled.match(result)) {
      await dispatch(fetchProfile(result.payload.accessToken));
    }
  };

  const onLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(loginUser(loginForm));
    if (loginUser.fulfilled.match(result)) {
      await dispatch(fetchProfile(result.payload.accessToken));
    }
  };

  return (
    <main className="container">
      <h1>Project Management Platform MVP Scaffold</h1>
      <p>
        Auth uses short-lived access tokens, DB-backed refresh token rotation, Redux Toolkit
        session state, and no Redis dependency in MVP.
      </p>

      {error && <p className="error">{error}</p>}

      <section className="panel-grid">
        <article className="panel">
          <h2>Register</h2>
          <form onSubmit={onRegisterSubmit}>
            <input
              placeholder="First name"
              value={registerForm.firstName}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, firstName: event.target.value }))
              }
            />
            <input
              placeholder="Last name"
              value={registerForm.lastName}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, lastName: event.target.value }))
              }
            />
            <input
              placeholder="Email"
              type="email"
              value={registerForm.email}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, email: event.target.value }))
              }
            />
            <input
              placeholder="Password"
              type="password"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, password: event.target.value }))
              }
            />
            <button type="submit" disabled={loading}>
              Register
            </button>
          </form>
        </article>

        <article className="panel">
          <h2>Login</h2>
          <form onSubmit={onLoginSubmit}>
            <input
              placeholder="Email"
              type="email"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, email: event.target.value }))
              }
            />
            <input
              placeholder="Password"
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, password: event.target.value }))
              }
            />
            <button type="submit" disabled={loading}>
              Login
            </button>
          </form>
        </article>
      </section>

      <section className="panel">
        <h2>Session</h2>
        <p>Status: {isAuthenticated ? 'Authenticated' : 'Anonymous'}</p>
        <p>User: {user ? `${user.email}` : 'Not loaded'}</p>
        <div className="actions">
          <button
            type="button"
            disabled={!tokens?.refreshToken || loading}
            onClick={async () => {
              if (!tokens?.refreshToken) {
                return;
              }

              const result = await dispatch(refreshSession(tokens.refreshToken));
              if (refreshSession.fulfilled.match(result)) {
                await dispatch(fetchProfile(result.payload.accessToken));
              }
            }}
          >
            Refresh Session
          </button>
          <button
            type="button"
            disabled={!tokens?.accessToken || loading}
            onClick={() => dispatch(logoutUser(tokens?.accessToken ?? null))}
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
