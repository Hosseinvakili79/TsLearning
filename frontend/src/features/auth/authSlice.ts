import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as authApi from './authApi';
import * as usersApi from '../users/usersApi';
import type { AuthTokens, AuthUser } from '../../shared/types';

const TOKENS_KEY = 'pmp_tokens';

function loadTokens(): AuthTokens | null {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    return raw ? (JSON.parse(raw) as AuthTokens) : null;
  } catch {
    return null;
  }
}

function saveTokens(tokens: AuthTokens | null) {
  if (tokens) {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  } else {
    localStorage.removeItem(TOKENS_KEY);
  }
}

interface AuthState {
  tokens: AuthTokens | null;
  user: AuthUser | null;
  loading: boolean;
  bootstrapped: boolean;
  error: string | null;
}

const initialState: AuthState = {
  tokens: loadTokens(),
  user: null,
  loading: false,
  bootstrapped: false,
  error: null,
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async (_, { getState }) => {
  const state = getState() as { auth: AuthState };
  const tokens = state.auth.tokens;
  if (!tokens?.accessToken) {
    return null;
  }
  try {
    return await authApi.me(tokens.accessToken);
  } catch {
    if (tokens.refreshToken) {
      const refreshed = await authApi.refresh(tokens.refreshToken);
      saveTokens(refreshed);
      const user = await authApi.me(refreshed.accessToken);
      return { user, tokens: refreshed };
    }
    saveTokens(null);
    return null;
  }
});

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: { firstName: string; lastName: string; email: string; password: string }) => {
    const tokens = await authApi.register(payload);
    saveTokens(tokens);
    const user = await authApi.me(tokens.accessToken);
    return { tokens, user };
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: { email: string; password: string }) => {
    const tokens = await authApi.login(payload);
    saveTokens(tokens);
    const user = await authApi.me(tokens.accessToken);
    return { tokens, user };
  },
);

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (accessToken: string) => {
  return authApi.me(accessToken);
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    payload: { firstName?: string; lastName?: string; avatar?: string | null },
    { getState },
  ) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.tokens?.accessToken;
    if (!token) {
      throw new Error('Not authenticated');
    }
    return usersApi.updateMe(token, payload);
  },
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    payload: { currentPassword: string; newPassword: string },
    { getState },
  ) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.tokens?.accessToken;
    if (!token) {
      throw new Error('Not authenticated');
    }
    return usersApi.changePassword(token, payload);
  },
);

export const refreshSession = createAsyncThunk(
  'auth/refreshSession',
  async (refreshToken: string) => {
    const tokens = await authApi.refresh(refreshToken);
    saveTokens(tokens);
    return tokens;
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (accessToken: string | null) => {
    if (accessToken) {
      await authApi.logout(accessToken).catch(() => undefined);
    }
    saveTokens(null);
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.bootstrapped = true;
        if (!action.payload) {
          state.tokens = null;
          state.user = null;
          return;
        }
        if ('tokens' in action.payload && action.payload.tokens) {
          state.tokens = action.payload.tokens;
          state.user = action.payload.user;
        } else {
          state.user = action.payload as AuthUser;
        }
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.bootstrapped = true;
        state.tokens = null;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload.tokens;
        state.user = action.payload.user;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload.tokens;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Authentication failed';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Authentication failed';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.tokens = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.tokens = null;
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
