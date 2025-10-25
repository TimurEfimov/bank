import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/user/apiUser";
import { AuthSelection } from "../pages/auth/AuthSelection";
import type { RootState } from "../redux/store";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state: RootState) => state.user);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId && !userData) {
      // @ts-ignore - временно игнорируем типы для dispatch
      dispatch(fetchUserData());
    }
  }, [userId, userData, dispatch]);

  // Показываем лоадер при загрузке
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  // Если нет пользователя - показываем авторизацию
  if (!userData) {
    console.log(userData)
    return <AuthSelection />;
  }

  // Если пользователь есть - показываем приложение
  return <>{children}</>;
};
