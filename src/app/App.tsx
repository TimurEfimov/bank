import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Home } from "../pages/home/Home";
import { Games } from "../pages/games/Games";
import { Profile } from "../pages/profile/Profile";
import { BottomNavigation } from "../components/BottomNavigation";
import { useAppDispatch } from "../redux/store";
import { fetchUserData } from "../redux/user/apiUser";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useLayoutEffect(() => {
    const path = location.pathname;

    if (path === "/games" || path === "/profile" || path === "/") {
      dispatch(fetchUserData());
      console.log("Fetching user data for path:", path);
    }
  }, [location.pathname, dispatch]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="pb-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <BottomNavigation />
      </div>
    </ProtectedRoute>
  );
};
