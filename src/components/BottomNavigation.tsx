import React from "react";
import { Home, User, CreditCard, CircleDollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("home");

  const tabs = [
    { id: "home", label: "Главная", icon: Home },
    { id: "casino", label: "Казино", icon: CircleDollarSign },
    { id: "finance", label: "Финансы", icon: CreditCard },
    { id: "profile", label: "Профиль", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-purple-950/95 border-t border-white/10 backdrop-blur-xl z-50">
      <div className="flex justify-around items-center py-3 px-4">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Link
              to={`/${tab.id === 'home' ? '' : tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? "text-purple-400 scale-110" : "text-white/60"
              }`}
            >
              <div
                className={`
                p-2 rounded-xl transition-all duration-300 border
                ${isActive 
                  ? "bg-purple-400/10 border-purple-400/30" 
                  : "bg-transparent border-transparent"
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
  );
};