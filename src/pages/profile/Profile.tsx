import React from "react";
import { HelpCircle, LogOut, Crown, Mail, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../redux/user/selectors";
import { clearUser } from "../../redux/user/slice";

export const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(getUserData);

  const menuItems = [
    {
      icon: HelpCircle,
      label: "Помощь",
      description: "FAQ и поддержка",
      color: "from-gray-500 to-slate-500",
      link: "https://t.me/endrychh",
    },
  ];

  // Форматирование даты регистрации
  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Получение инициалов для аватара
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Профиль</h1>
          <p className="text-gray-400">Управление аккаунтом и настройками</p>
        </div>

        {/* Карточка профиля */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-gray-600">
                {userData ? getInitials(userData.fullName) : "Г"}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-gray-800">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">
                {userData?.fullName || "Гость"}
              </h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <Mail className="w-4 h-4" />
                <span>{userData?.email || "email@example.com"}</span>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                ${userData?.card?.points?.toLocaleString("ru-RU") || "0"}
              </div>
              <div className="text-gray-400 text-xs">Баланс</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {userData?.stats?.gamesPlayed || 0}
              </div>
              <div className="text-gray-400 text-xs">Игр сыграно</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {userData?.stats?.wins || 0}
              </div>
              <div className="text-gray-400 text-xs">Побед</div>
            </div>
          </div>

          {/* Процент побед */}
          {userData?.stats?.gamesPlayed && userData.stats.gamesPlayed > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Процент побед</span>
                <span>
                  {Math.round(
                    (userData.stats.wins / userData.stats.gamesPlayed) * 100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (userData.stats.wins / userData.stats.gamesPlayed) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Дата регистрации */}
        {userData?.joinedDate && (
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 mb-4">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Участник с {formatJoinedDate(userData.joinedDate)}</span>
            </div>
          </div>
        )}

        {/* Меню настроек */}
        <div className="space-y-3 mb-4">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a href={item.link} target="_blank" rel="noreferrer" key={index}>
                <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm">
                        {item.label}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-gray-400 hover:text-white transition-colors">
                      →
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Кнопка выхода */}
        <button
          onClick={() => dispatch(clearUser())}
          className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-red-500 text-red-400 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};
