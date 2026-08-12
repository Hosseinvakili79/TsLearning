import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as authApi from './authApi';
import type { AuthTokens, AuthUser } from '../../shared/types';

interface AuthState {
  tokens: AuthTokens | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  tokens: null,
  user: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: { firstName: string; lastName: string; email: string; password: string }) => {
    return authApi.register(payload);
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: { email: string; password: string }) => {
    return authApi.login(payload);
  },
);

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (accessToken: string) => {
  return authApi.me(accessToken);
});

export const refreshSession = createAsyncThunk(
  'auth/refreshSession',
  async (refreshToken: string) => {
    return authApi.refresh(refreshToken);
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (accessToken: string | null) => {
    if (accessToken) {
      await authApi.logout(accessToken);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Authentication failed';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Authentication failed';
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Authentication failed';
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Authentication failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.tokens = null;
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
