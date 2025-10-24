import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/home/Home";
import { BottomNavigation } from "../components/BottomNavigation";
import { Casino } from "../pages/casino/Casino";
import { Profile } from "../pages/profile/Profile";
import { Finance } from "../pages/finance/finance";

export const App: React.FC = () => {
  return (
    <>
      <div className="pb-20">
        {" "}
        {/* Отступ для bottom navigation */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/casino" element={<Casino />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/finance" element={<Finance />} />
        </Routes>
      </div>
      <BottomNavigation />
    </>
  );
};
