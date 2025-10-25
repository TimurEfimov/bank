import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "./types";
import { authUser } from "./auth";
import { registerUser } from "./register";
import { fetchUserData } from "./apiUser";

const initialState: UserState = {
  userData: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.userData = null;
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Общие состояния для всех async actions
      .addCase(authUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Успешные кейсы
      .addCase(authUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })

      // Ошибки
      .addCase(authUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Authentication failed";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Fetching user data failed";
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
