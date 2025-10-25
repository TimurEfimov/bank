import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RegisterUserData } from "./types";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData: RegisterUserData) => {
    const res = await fetch("https://9303851354d5e8f0.mokky.dev/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: userData.name,
        email: userData.email,
        password: userData.password,
      }),
    });

    if (!res.ok) {
      throw new Error("Registration failed");
    }

    const data = await res.json();
    console.log("User registered:", userData);

    // После регистрации автоматически логиним пользователя
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.data.id.toString());

    return data; // Возвращаем данные для сохранения в стейт
  }
);
