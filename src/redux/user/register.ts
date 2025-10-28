import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RegisterUserData } from "./types";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData: RegisterUserData) => {
    // Генерируем номер карты: 2200 + 12 случайных цифр
    const generateCardNumber = () => {
      const randomPart = Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");
      return `2200${randomPart}`;
    };

    // Генерируем дату на 4 года вперед
    const generateCardDate = () => {
      const now = new Date();
      const futureDate = new Date(
        now.getFullYear() + 4,
        now.getMonth(),
        now.getDate()
      );
      const month = (futureDate.getMonth() + 1).toString().padStart(2, "0");
      const year = futureDate.getFullYear().toString().slice(-2);
      return `${month}/${year}`;
    };

    // Генерируем 3 случайных цифры для кода
    const generateCardCode = () => {
      return Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");
    };

    const cardNumber = generateCardNumber();
    const cardDate = generateCardDate();
    const cardCode = generateCardCode();

    const res = await fetch("https://7437cc39e8e31242.mokky.dev/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        fullName: userData.name,
        password: userData.password,

        profile: {
          avatar: "",
          phone: 0,
        },

        stats: {
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
        },

        card: {
          points: 10000,
          number: cardNumber,
          code: cardCode,
          date: cardDate,
        },

        joinedDate: new Date(),
      }),
    });

    if (!res.ok) {
      throw new Error("Registration failed");
    }

    const data = await res.json();

    // После регистрации автоматически логиним пользователя
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.data.id.toString());

    return data; // Возвращаем данные для сохранения в стейт
  }
);
