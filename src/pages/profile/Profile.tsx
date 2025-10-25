import React from 'react';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, CreditCard, Crown, Star } from 'lucide-react';

export const Profile: React.FC = () => {
  const userData = {
    name: "Андрей Б.",
    username: "@andrey_b",
    level: 12,
    experience: 750,
    nextLevelExp: 1000,
    balance: 15470.85,
    gamesPlayed: 47,
    wins: 28,
    joinedDate: "15.10.2024"
  };

  const menuItems = [
    {
      icon: CreditCard,
      label: "Платежи и карты",
      description: "Привязанные карты и история платежей",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Bell,
      label: "Уведомления",
      description: "Настройка оповещений",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      label: "Безопасность",
      description: "Пароль, 2FA, история входов",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Settings,
      label: "Настройки",
      description: "Настройки приложения",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: HelpCircle,
      label: "Помощь",
      description: "FAQ и поддержка",
      color: "from-gray-500 to-slate-500"
    }
  ];

  const progressPercentage = (userData.experience / userData.nextLevelExp) * 100;

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
              АБ
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-purple-900">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{userData.name}</h2>
            <p className="text-purple-300/70 text-sm">{userData.username}</p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-semibold">Уровень {userData.level}</span>
            </div>
          </div>
        </div>

        {/* Прогресс бар уровня */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Опыт: {userData.experience}/{userData.nextLevelExp}</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{userData.balance.toLocaleString('ru-RU')} ₽</div>
            <div className="text-white/60 text-xs">Баланс</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{userData.gamesPlayed}</div>
            <div className="text-white/60 text-xs">Игр сыграно</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{userData.wins}</div>
            <div className="text-white/60 text-xs">Побед</div>
          </div>
        </div>
      </div>

      {/* Дата регистрации */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6 backdrop-blur-sm">
        <div className="text-center text-white/60 text-sm">
          Участник с {userData.joinedDate}
        </div>
      </div>

      {/* Меню настроек */}
      <div className="space-y-3">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:scale-100 cursor-pointer group backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{item.label}</h3>
                  <p className="text-purple-300/70 text-sm">{item.description}</p>
                </div>
                <div className="text-white/40 group-hover:text-white transition-colors">
                  →
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Кнопка выхода */}
      <button className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-400/30 text-red-400 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 group">
        <LogOut className="w-5 h-5" />
        Выйти из аккаунта
      </button>
    </div>
  );
};