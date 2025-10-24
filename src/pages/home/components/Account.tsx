import React from "react";
import {
  CreditCard,
  Plus,
  ArrowRightLeft,
  Eye,
  EyeOff,
  Calendar,
  QrCode,
} from "lucide-react";

export const Account: React.FC = () => {
  const [balance, setBalance] = React.useState(15470.85);
  const [isBalanceVisible, setIsBalanceVisible] = React.useState(true);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})/g, "$1 ").trim();
  };

  // Реалистичные данные карты
  const cardData = {
    number: "5536913762891234",
    expiry: "12/26",
    holder: "АНДРЕЙ Б.",
    system: "VISA",
    balance: 15470.85,
    currency: "RUB",
  };

  // Реалистичные транзакции
  const transactions = [
    {
      id: 1,
      type: "income" as const,
      name: "Перевод от Ивана П.",
      amount: 5000.0,
      date: "15.10.2025 14:30",
      category: "Перевод",
      icon: "👤",
    },
    {
      id: 2,
      type: "outcome" as const,
      name: "Оплата Яндекс.Еда",
      amount: -1547.5,
      date: "14.10.2025 19:15",
      category: "Продукты",
      icon: "🛒",
    },
    {
      id: 3,
      type: "income" as const,
      name: "Кэшбэк за декабрь",
      amount: 327.35,
      date: "13.10.2025 09:00",
      category: "Кэшбэк",
      icon: "💸",
    },
    {
      id: 4,
      type: "outcome" as const,
      name: "Spotify Premium",
      amount: -299.0,
      date: "10.10.2025 00:01",
      category: "Подписки",
      icon: "🎵",
    },
    {
      id: 5,
      type: "outcome" as const,
      name: "Такси Яндекс Go",
      amount: -456.0,
      date: "11.10.2025 22:45",
      category: "Транспорт",
      icon: "🚗",
    },
  ];

  return (
    <div className="mx-4 my-6 space-y-4">
      {/* Банковская карта */}
      <div className="bg-gradient-to-br from-purple-950/90 via-purple-900/80 to-purple-800/70 rounded-2xl p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden backdrop-blur-sm">
        {/* Декоративные элементы карты */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/5 rounded-full -translate-x-10 translate-y-12"></div>

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h3 className="text-white/70 text-sm font-medium mb-2">
              Баланс счета
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-white tracking-tight">
                {isBalanceVisible ? `${formatBalance(balance)} ₽` : "••••• ₽"}
              </span>
              <button
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
              >
                {isBalanceVisible ? (
                  <EyeOff className="w-5 h-5 text-white/50" />
                ) : (
                  <Eye className="w-5 h-5 text-white/50" />
                )}
              </button>
            </div>
          </div>
          <div className="text-right">
            <CreditCard className="w-10 h-10 text-emerald-400 mb-2" />
            <div className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full border border-white/10">
              {cardData.system}
            </div>
          </div>
        </div>

        {/* Номер карты */}
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="flex gap-3">
            {formatCardNumber(cardData.number)
              .split(" ")
              .map((part, index) => (
                <span
                  key={index}
                  className={`text-lg font-mono font-bold ${
                    index < 3 ? "text-white/30" : "text-white/80"
                  }`}
                >
                  {index < 3 ? "••••" : part}
                </span>
              ))}
          </div>
        </div>

        {/* Детали карты */}
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-white/50 text-xs mb-1">Срок действия</div>
              <div className="text-white font-medium flex items-center gap-1">
                <Calendar className="w-4 h-4 text-white/60" />
                {cardData.expiry}
              </div>
            </div>
            <div>
              <div className="text-white/50 text-xs mb-1">Владелец</div>
              <div className="text-white font-medium">{cardData.holder}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/50 text-xs mb-1">Валюта</div>
            <div className="text-white font-medium">{cardData.currency}</div>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="grid grid-cols-3 gap-3">
        <button className="bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex flex-col items-center justify-center gap-2 group border border-blue-500/20">
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span className="font-semibold text-sm text-center">Пополнить</span>
        </button>

        <button className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex flex-col items-center justify-center gap-2 group border border-orange-500/20">
          <ArrowRightLeft className="w-6 h-6 group-hover:rotate-180 transition-transform" />
          <span className="font-semibold text-sm text-center">Перевести</span>
        </button>

        <button className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex flex-col items-center justify-center gap-2 group border border-green-500/20">
          <QrCode className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm text-center">QR-код</span>
        </button>
      </div>

      {/* История операций */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
        <h4 className="text-white font-semibold mb-4 text-lg">
          История операций
        </h4>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    transaction.type === "income"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {transaction.icon}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {transaction.name}
                  </div>
                  <div className="text-white/40 text-sm">
                    {transaction.date}
                  </div>
                  <div className="text-white/30 text-xs mt-1">
                    {transaction.category}
                  </div>
                </div>
              </div>
              <div
                className={`text-lg font-bold text-nowrap ${
                  transaction.type === "income"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {transaction.type === "income" ? "+" : ""}
                {formatBalance(transaction.amount)} ₽
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
