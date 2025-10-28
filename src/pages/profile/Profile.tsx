import React from "react";
import {
  HelpCircle,
  LogOut,
  Crown,
  Mail,
  Calendar,
} from "lucide-react";
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
    <div className="mx-4 my-6">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Профиль</h1>
        <p className="text-purple-300/70">Управление аккаунтом и настройками</p>
      </div>

      {/* Карточка профиля */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-purple-400/30">
              {userData ? getInitials(userData.fullName) : "Г"}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-purple-900">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">
              {userData?.fullName || "Гость"}
            </h2>
            <div className="flex items-center gap-2 text-purple-300/70 text-sm mt-1">
              <Mail className="w-4 h-4" />
              <span>{userData?.email || "email@example.com"}</span>
            </div>
            {/* {userData?.profile?.phone && (
              <div className="flex items-center gap-2 text-purple-300/70 text-sm mt-1">
                <Phone className="w-4 h-4" />
                <span>{userData.profile.phone && userData.profile.phone}</span>
              </div>
            )} */}
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {userData?.card?.points?.toLocaleString("ru-RU") || "0"}
            </div>
            <div className="text-white/60 text-xs">Баланс(₽)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {userData?.stats?.gamesPlayed || 0}
            </div>
            <div className="text-white/60 text-xs">Игр сыграно</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {userData?.stats?.wins || 0}
            </div>
            <div className="text-white/60 text-xs">Побед</div>
          </div>
        </div>

        {/* Процент побед */}
        {userData?.stats?.gamesPlayed && userData.stats.gamesPlayed > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-white/60 mb-1">
              <span>Процент побед</span>
              <span>
                {Math.round(
                  (userData.stats.wins / userData.stats.gamesPlayed) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
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
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Участник с {formatJoinedDate(userData.joinedDate)}</span>
          </div>
        </div>
      )}

      {/* Меню настроек */}
      <div className="space-y-3">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <a href={item.link} target="_blank" rel="noreferrer" key={index}>
              <div
                key={index}
                className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:scale-100 cursor-pointer group backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      {item.label}
                    </h3>
                    <p className="text-purple-300/70 text-sm">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-white/40 group-hover:text-white transition-colors">
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
        className="w-full mt-6 py-4 bg-white/5 cursor-pointer hover:bg-white/10 border border-white/10 hover:border-red-400/30 text-red-400 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 group"
      >
        <LogOut className="w-5 h-5" />
        Выйти из аккаунта
      </button>
    </div>
  );
};
