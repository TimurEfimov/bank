import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { useSelector } from "react-redux";
import userReducer from "./user/slice"; // Импортируем твой слайс

export const store = configureStore({
  reducer: {
    user: userReducer, // Добавляем твой слайс в редюсер
  },
});

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;