import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Home } from "../pages/home/Home";
import { Casino } from "../pages/casino/Casino";
import { Finance } from "../pages/finance/Finance";
import { Profile } from "../pages/profile/Profile";
import { BottomNavigation } from "../components/BottomNavigation";

export const App: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/casino" element={<Casino />} />
          <Route path="/account" element={<Finance />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNavigation />
      </div>
    </ProtectedRoute>
  );
};
