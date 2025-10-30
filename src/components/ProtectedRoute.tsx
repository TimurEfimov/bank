import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/user/apiUser";
import { AuthSelection } from "../pages/auth/AuthSelection";
import type { RootState } from "../redux/store";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("render");

  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId && !userData) {
      // @ts-ignore - временно игнорируем типы для dispatch
      dispatch(fetchUserData());
    }
  });

  // Красивый лоадер
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          {/* Анимированный логотип */}
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gray-700 rounded-xl mx-auto animate-pulse"></div>
          </div>

          {/* Текст */}
          <h2 className="text-xl font-bold text-white mb-2">Загрузка</h2>
          <p className="text-gray-400 text-sm mb-4">
            Подготавливаем ваш аккаунт...
          </p>

          {/* Анимированные точки */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Если нет пользователя - показываем авторизацию
  if (!userData) {
    return <AuthSelection />;
  }

  // Если пользователь есть - показываем приложение
  return <>{children}</>;
};
