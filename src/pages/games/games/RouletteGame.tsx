import React, { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";

export interface RouletteGameProps {
  balance: number;
  setBalance: (balance: number) => void;
  onBack: () => void;
  onGameResult: (
    result: "win" | "loss",
    amount: number,
    newBalance: number
  ) => void;
}

// Правильное расположение чисел для европейской рулетки
const rouletteNumbers = [
  { number: "0", color: "green" },
  { number: "32", color: "red" },
  { number: "15", color: "black" },
  { number: "19", color: "red" },
  { number: "4", color: "black" },
  { number: "21", color: "red" },
  { number: "2", color: "black" },
  { number: "25", color: "red" },
  { number: "17", color: "black" },
  { number: "34", color: "red" },
  { number: "6", color: "black" },
  { number: "27", color: "red" },
  { number: "13", color: "black" },
  { number: "36", color: "red" },
  { number: "11", color: "black" },
  { number: "30", color: "red" },
  { number: "8", color: "black" },
  { number: "23", color: "red" },
  { number: "10", color: "black" },
  { number: "5", color: "red" },
  { number: "24", color: "black" },
  { number: "16", color: "red" },
  { number: "33", color: "black" },
  { number: "1", color: "red" },
  { number: "20", color: "black" },
  { number: "14", color: "red" },
  { number: "31", color: "black" },
  { number: "9", color: "red" },
  { number: "22", color: "black" },
  { number: "18", color: "red" },
  { number: "29", color: "black" },
  { number: "7", color: "red" },
  { number: "28", color: "black" },
  { number: "12", color: "red" },
  { number: "35", color: "black" },
  { number: "3", color: "red" },
  { number: "26", color: "black" },
];

type BetType = "red" | "black" | "green" | "number" | null;
type BetOption = {
  type: BetType;
  label: string;
  multiplier: number;
  description: string;
};

const betOptions: BetOption[] = [
  { type: "red", label: "🔴 Красное", multiplier: 2, description: "x2" },
  { type: "black", label: "⚫ Черное", multiplier: 2, description: "x2" },
  { type: "green", label: "🟢 Ноль", multiplier: 36, description: "x36" },
  {
    type: "number",
    label: "🎯 Конкретное число",
    multiplier: 36,
    description: "x36",
  },
];

export const RouletteGame: React.FC<RouletteGameProps> = ({
  balance,
  setBalance,
  onBack,
  onGameResult,
}) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedBet, setSelectedBet] = useState<BetType>(null);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningNumber, setWinningNumber] = useState<string | null>(null);
  const [winningColor, setWinningColor] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null);
  const [winAmount, setWinAmount] = useState<number>(0);

  const wheelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  const spinWheel = () => {
    if (isSpinning || !selectedBet || betAmount > balance) return;

    setIsSpinning(true);
    setGameResult(null);
    setWinningNumber(null);
    setWinningColor(null);

    // Сначала списываем ставку
    const newBalance = balance - betAmount;
    setBalance(newBalance);

    // Анимация вращения с использованием CSS transitions
    const wheel = wheelRef.current;
    if (!wheel) return;

    // Сбрасываем трансформацию
    wheel.style.transition = "none";
    wheel.style.transform = "rotate(0deg)";

    // Форсируем рефлоу
    wheel.offsetHeight;

    // Запускаем анимацию
    const startTime = Date.now();
    const spinDuration = 4000;
    const totalRotations = 5; // Уменьшил количество оборотов для мобильных

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      if (progress < 1) {
        // Продолжаем анимацию
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const rotation = easeOut * 360 * totalRotations;

        wheel.style.transition = "none";
        wheel.style.transform = `rotate(${rotation}deg)`;

        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Завершение анимации
        const finalIndex = Math.floor(Math.random() * rouletteNumbers.length);
        const finalNumber = rouletteNumbers[finalIndex];

        // Плавное завершение вращения к финальной позиции
        const finalRotation = (finalIndex / rouletteNumbers.length) * 360;
        wheel.style.transition = "transform 1s cubic-bezier(0.2, 0.8, 0.3, 1)";
        wheel.style.transform = `rotate(${
          360 * totalRotations + finalRotation
        }deg)`;

        setTimeout(() => {
          setWinningNumber(finalNumber.number);
          setWinningColor(finalNumber.color);
          setIsSpinning(false);
          checkResult(finalNumber);
        }, 1000);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const checkResult = (finalNumber: { number: string; color: string }) => {
    let isWin = false;
    let multiplier = 1;

    switch (selectedBet) {
      case "red":
        isWin = finalNumber.color === "red";
        multiplier = 2;
        break;
      case "black":
        isWin = finalNumber.color === "black";
        multiplier = 2;
        break;
      case "green":
        isWin = finalNumber.number === "0";
        multiplier = 36;
        break;
      case "number":
        isWin = finalNumber.number === selectedNumber;
        multiplier = 36;
        break;
    }

    if (isWin) {
      const win = betAmount * multiplier;
      setGameResult("win");
      setWinAmount(win);
      const newBalance = balance - betAmount + win;
      setBalance(newBalance);
      onGameResult("win", win, newBalance);
    } else {
      setGameResult("loss");
      setWinAmount(betAmount);
      onGameResult("loss", betAmount, balance - betAmount);
    }
  };

  const increaseBet = (amount: number) => {
    const newBet = betAmount + amount;
    if (newBet <= balance) {
      setBetAmount(newBet);
    }
  };

  const setMaxBet = () => {
    setBetAmount(balance);
  };

  const handleBetSelect = (betType: BetType) => {
    setSelectedBet(betType);
    if (betType !== "number") {
      setSelectedNumber(null);
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-600";
      case "black":
        return "bg-gray-900";
      case "green":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const getTextColorClass = (color: string) => {
    return color === "black" ? "text-white" : "text-white";
  };

  const getCurrentMultiplier = () => {
    const option = betOptions.find((opt) => opt.type === selectedBet);
    return option ? option.multiplier : 1;
  };

  // Функция для получения правильного угла для каждого числа
  const getNumberPosition = (index: number) => {
    const angle = (index / rouletteNumbers.length) * 360 - 90;
    return angle;
  };

  // Очистка анимации при размонтировании
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Рулетка</h1>
          <div className="text-white/60 text-sm">
            Баланс: {balance.toLocaleString()} ₽
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Рулетка */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Внешний круг */}
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 md:border-8 border-yellow-500 bg-gradient-to-br from-yellow-600 to-yellow-800 p-3 md:p-4">
              {/* Вращающееся колесо */}
              <div className="relative w-full h-full">
                <div
                  ref={wheelRef}
                  className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 md:border-4 border-yellow-400 relative"
                  style={{
                    willChange: "transform", // Оптимизация для анимации
                  }}
                >
                  {/* Центральный круг */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-yellow-300 flex items-center justify-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border border-yellow-200 flex items-center justify-center">
                      {winningNumber && (
                        <span className="text-black font-bold text-xs md:text-sm">
                          {winningNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Числа на рулетке */}
                  {rouletteNumbers.map((item, index) => {
                    const angle = getNumberPosition(index);
                    const radius = 90; // Уменьшил радиус для мобильных
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <div
                        key={item.number}
                        className={`absolute w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/30 flex items-center justify-center text-xs font-bold shadow-lg ${getColorClass(
                          item.color
                        )} ${getTextColorClass(item.color)}`}
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {item.number}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Статический указатель */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
              <div className="relative">
                {/* Основание указателя */}
                <div className="w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
                {/* Стрелка */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-6 md:-translate-y-8 w-0 h-0 border-l-4 border-r-4 border-b-6 md:border-l-6 md:border-r-6 md:border-b-8 border-l-transparent border-r-transparent border-b-red-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Результат */}
        <div className="text-center mb-4">
          {winningNumber && winningColor && (
            <>
              <div className="text-white/60 text-sm mb-2">Выпало:</div>
              <div
                className={`text-xl md:text-3xl font-bold px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl inline-block shadow-lg ${getColorClass(
                  winningColor
                )} border border-white/30`}
              >
                {winningNumber}{" "}
                <span className="text-lg md:text-2xl">
                  {winningColor === "red"
                    ? "🔴"
                    : winningColor === "black"
                    ? "⚫"
                    : "🟢"}
                </span>
              </div>
            </>
          )}
        </div>

        {gameResult && (
          <div
            className={`text-center text-lg md:text-xl font-bold mb-4 ${
              gameResult === "win" ? "text-green-400" : "text-red-400"
            }`}
          >
            {gameResult === "win" &&
              `🎉 Выигрыш ${winAmount.toLocaleString()} ₽!`}
            {gameResult === "loss" &&
              `😞 Проигрыш ${betAmount.toLocaleString()} ₽`}
          </div>
        )}

        {/* Кнопка вращения */}
        <button
          onClick={spinWheel}
          disabled={isSpinning || !selectedBet || betAmount > balance}
          className={`w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 ${
            isSpinning || !selectedBet || betAmount > balance
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
          }`}
        >
          {isSpinning ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Крутим...
            </div>
          ) : (
            "🎰 Крутить рулетку"
          )}
        </button>
      </div>

      {/* Остальной код с адаптацией для мобильных */}
      {/* Выбор ставки */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
        <div className="text-white/60 text-sm mb-3">Тип ставки</div>
        <div className="grid grid-cols-2 gap-2">
          {betOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleBetSelect(option.type)}
              className={`p-2 md:p-3 rounded-lg md:rounded-xl border transition-all text-left ${
                selectedBet === option.type
                  ? "bg-purple-600 border-purple-400 shadow-lg"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="font-semibold text-sm md:text-base">
                {option.label}
              </div>
              <div className="text-white/60 text-xs md:text-sm">
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Выбор числа */}
      {selectedBet === "number" && (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
          <div className="text-white/60 text-sm mb-3">Выберите число</div>
          <div className="grid grid-cols-6 gap-1 md:gap-2 max-h-32 md:max-h-40 overflow-y-auto">
            {rouletteNumbers.map((item) => (
              <button
                key={item.number}
                onClick={() => setSelectedNumber(item.number)}
                className={`p-1 md:p-2 rounded md:rounded-lg border transition-all ${getColorClass(
                  item.color
                )} ${
                  selectedNumber === item.number
                    ? "ring-2 ring-yellow-400 shadow-lg"
                    : "hover:opacity-80"
                }`}
              >
                <span className="text-xs md:text-sm">{item.number}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Управление ставкой */}
      <div className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm md:text-base">
              Сумма ставки
            </span>
            <span className="font-bold text-base md:text-lg">
              {betAmount.toLocaleString()} ₽
            </span>
          </div>

          <div className="flex gap-2 mb-3">
            {[100, 500, 1000].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`flex-1 py-2 rounded-lg border transition-all text-sm ${
                  betAmount === amount
                    ? "bg-purple-600 border-purple-400"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {amount}
              </button>
            ))}
            <button
              onClick={setMaxBet}
              className="flex-1 py-2 rounded-lg border border-yellow-400/30 bg-yellow-400/10 hover:bg-yellow-400/20 transition-all text-sm"
            >
              MAX
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => increaseBet(100)}
              className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm"
            >
              +100
            </button>
            <button
              onClick={() => increaseBet(500)}
              className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm"
            >
              +500
            </button>
          </div>
        </div>

        {selectedBet && (
          <div className="text-center text-white/60 text-xs md:text-sm">
            Множитель:{" "}
            <span className="text-yellow-400 font-bold">
              x{getCurrentMultiplier()}
            </span>{" "}
            • Выигрыш:{" "}
            <span className="text-green-400 font-bold">
              {(betAmount * getCurrentMultiplier()).toLocaleString()} ₽
            </span>
          </div>
        )}
      </div>

      {/* Правила */}
      <div className="mt-4 text-center text-white/50 text-xs">
        🔴 Красное (x2) • ⚫ Черное (x2) • 🟢 Ноль (x36) • 🎯 Число (x36)
      </div>
    </div>
  );
};
