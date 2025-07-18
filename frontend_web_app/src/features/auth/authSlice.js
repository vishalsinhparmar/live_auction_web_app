
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserData, userSignIn, userSignUp } from "../../services/services";

// Thunks
export const signUp = createAsyncThunk('auth/signUp', userSignUp);
export const login = createAsyncThunk('auth/login', userSignIn);
export const loginUser = createAsyncThunk('auth/loginUser', loginUserData);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: null,
    user: null,
    token: null,
    error: {
      login: null,
      signUp: null,
    },
    message: {
      login: null,
      signUp: null,
    }
  },
  reducers: {
    resetAuthState: (state) => {
      state.error = { login: null, signUp: null };
      state.message = { login: null, signUp: null };
    }
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error.signUp = null;
        state.message.signUp = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.message.signUp = action.payload.message;
        } else {
          state.error.signUp = action.payload?.message;
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error.signUp = action.error.message;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error.login = null;
        state.message.login = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.message.login = action.payload.message;
          state.token = action.payload.data;
          localStorage.setItem('authToken', action.payload.data);
        } else {
          state.error.login = action.payload?.message;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error.login = action.error.message;
      })

      // Get Logged-In User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error.login = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.user = action.payload.data;
        } else {
          state.error.login = action.payload?.message;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error.login = action.error.message;
      });
  }
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;