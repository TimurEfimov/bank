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
      {/* Spacer для контента - занимает место чтобы контент не скрывался за навигацией */}
      <div className="h-20" />

      {/* Сама навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-purple-950/95 border-t border-white/10 backdrop-blur-xl z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center py-3 px-4 max-w-md mx-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = currentPath === tab.id;

            return (
              <Link
                to={tab.path}
                key={tab.id}
                className={`flex flex-col items-center gap-1 transition-all duration-300 flex-1 ${
                  isActive ? "text-purple-400 scale-105" : "text-white/60"
                }`}
              >
                <div
                  className={`
                  p-2 rounded-xl transition-all duration-300 border
                  ${
                    isActive
                      ? "bg-purple-400/10 border-purple-400/30"
                      : "bg-transparent border-transparent hover:bg-white/5"
                  }
                `}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-medium transition-all duration-300 ${
                    isActive ? "text-purple-400" : "text-white/60"
                  }`}
                >
                  {tab.label}
                </span>

                {/* Индикатор активной вкладки */}
                {isActive && (
                  <div className="w-1 h-1 bg-purple-400 rounded-full mt-1"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
