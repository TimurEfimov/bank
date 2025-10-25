import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthCredentials } from "./types";

export const authUser = createAsyncThunk(
  "user/authUser",
  async (credentials: AuthCredentials) => {
    const res = await fetch("https://7437cc39e8e31242.mokky.dev/auth", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!res.ok) {
      throw new Error("Authentication failed");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.data.id.toString());
    return data; // Возвращаем данные для сохранения в стейт
  }
);
