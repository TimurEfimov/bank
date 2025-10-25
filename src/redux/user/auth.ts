import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthCredentials } from "./types";

export const authUser = createAsyncThunk(
  "user/authUser",
  async (credentials: AuthCredentials) => {
    const res = await fetch("https://9303851354d5e8f0.mokky.dev/auth", {
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

    console.log(localStorage.getItem("userId"));
    console.log(localStorage.getItem("token"));

    console.log("User authenticated:", credentials);
    return data; // Возвращаем данные для сохранения в стейт
  }
);
