import React from "react";
import { Home, User, CircleDollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.replace("/", "") || "home";

  const tabs = [
    { id: "home", label: "Главная", icon: Home, path: "/" },
    { id: "games", label: "Игры", icon: CircleDollarSign, path: "/games" },
    { id: "profile", label: "Профиль", icon: User, path: "/profile" },
  ];

  return (
    <>
      {/* Spacer для контента */}
      <div className="h-16" />

      {/* Сама навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = currentPath === tab.id;

            return (
              <Link
                to={tab.path}
                key={tab.id}
                className={`flex flex-col items-center gap-1 transition-colors flex-1 ${
                  isActive ? "text-green-400" : "text-gray-400"
                }`}
              >
                <div
                  className={`
                  p-2 rounded-lg transition-colors
                  ${isActive ? "bg-green-500/10" : "hover:bg-gray-700"}
                `}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>

                {/* Индикатор активной вкладки */}
                {isActive && (
                  <div className="w-1 h-1 bg-green-400 rounded-full mt-1"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
