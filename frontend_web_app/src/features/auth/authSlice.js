import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserData, userSignIn, userSignUp } from "../../services/services";

export const signUp = createAsyncThunk("auth/signUp", async (form, { rejectWithValue }) => {
  try {
    return await userSignUp(form);
  } catch (error) {
    return rejectWithValue(error.message || "Sign up failed.");
  }
});

export const login = createAsyncThunk("auth/login", async (form, { rejectWithValue }) => {
  try {
    return await userSignIn(form);
  } catch (error) {
    return rejectWithValue(error.message || "Login failed.");
  }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (_, { rejectWithValue }) => {
  try {
    return await loginUserData();
  } catch (error) {
    return rejectWithValue(error.message || "Unable to fetch user profile.");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: {
      login: false,
      signUp: false,
      loginUser: false,
    },
    user: null,
    token: null,
    error: {
      login: null,
      signUp: null,
    },
    message: {
      login: null,
      signUp: null,
    },
  },
  reducers: {
    resetAuthState: (state) => {
      state.error = { login: null, signUp: null };
      state.message = { login: null, signUp: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading.signUp = true;
        state.error.signUp = null;
        state.message.signUp = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading.signUp = false;
        if (action.payload?.success) {
          state.message.signUp = action.payload.message;
        } else {
          state.error.signUp = action.payload?.message || "Sign up failed.";
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading.signUp = false;
        state.error.signUp = action.payload || action.error.message;
      })

      .addCase(login.pending, (state) => {
        state.loading.login = true;
        state.error.login = null;
        state.message.login = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading.login = false;
        if (action.payload?.success) {
          state.message.login = action.payload.message;
          state.token = action.payload.data;
          localStorage.setItem("authToken", action.payload.data);
        } else {
          state.error.login = action.payload?.message || "Login failed.";
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading.login = false;
        state.error.login = action.payload || action.error.message;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading.loginUser = true;
        state.error.login = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.loginUser = false;
        if (action.payload?.success) {
          state.user = action.payload.data;
        } else {
          state.error.login = action.payload?.message;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.loginUser = false;
        state.error.login = action.payload || action.error.message;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
