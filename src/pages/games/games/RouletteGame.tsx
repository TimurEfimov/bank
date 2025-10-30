import React, { useState, useRef } from "react";
import { ArrowLeft, Target, Trophy, Star } from "lucide-react";
import type { GamesProps } from "../Games";

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

export const RouletteGame: React.FC<GamesProps> = ({
  points,
  setPoints,
  onBack,
  onGameResult,
  bet,
}) => {
  const [entryPoints, setEntryPoints] = useState<number>(bet.min);
  const [selectedBet, setSelectedBet] = useState<BetType>(null);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningNumber, setWinningNumber] = useState<string | null>(null);
  const [winningColor, setWinningColor] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null);
  const [pointsWon, setPointsWon] = useState<number>(0);
  const [displayedNumbers, setDisplayedNumbers] = useState<string[]>([]);

  const spinRoulette = () => {
    if (isSpinning || !selectedBet || entryPoints > points) return;

    setIsSpinning(true);
    setGameResult(null);
    setWinningNumber(null);
    setWinningColor(null);

    // Сначала списываем очки участия
    const newPoints = points - entryPoints;
    setPoints(newPoints);

    // Анимация быстрой смены чисел
    let counter = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomNumbers = Array.from({ length: 5 }, () => {
        const randomIndex = Math.floor(Math.random() * rouletteNumbers.length);
        return rouletteNumbers[randomIndex].number;
      });
      setDisplayedNumbers(randomNumbers);
      counter++;

      if (counter >= maxCount) {
        clearInterval(interval);

        // Финальный результат
        const finalIndex = Math.floor(Math.random() * rouletteNumbers.length);
        const finalNumber = rouletteNumbers[finalIndex];

        setWinningNumber(finalNumber.number);
        setWinningColor(finalNumber.color);
        setDisplayedNumbers([finalNumber.number]);

        setTimeout(() => {
          setIsSpinning(false);
          checkResult(finalNumber);
        }, 500);
      }
    }, 100);
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
      const pointsChange = entryPoints * (multiplier - 1);
      setGameResult("win");
      setPointsWon(pointsChange);
      const newPoints = points - entryPoints + entryPoints * multiplier;
      setPoints(newPoints);
      onGameResult("win", pointsChange, newPoints);
    } else {
      setGameResult("loss");
      setPointsWon(entryPoints);
      onGameResult("loss", entryPoints, points - entryPoints);
    }
  };

  const increaseEntry = (amount: number) => {
    const newEntry = entryPoints + amount;
    if (newEntry <= points) {
      setEntryPoints(newEntry);
    }
  };

  const setMaxEntry = () => {
    setEntryPoints(Math.min(points, bet.max));
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

  const getCurrentMultiplier = () => {
    const option = betOptions.find((opt) => opt.type === selectedBet);
    return option ? option.multiplier : 1;
  };

  const getWinningNumberColor = (number: string) => {
    const numberData = rouletteNumbers.find((item) => item.number === number);
    return numberData ? numberData.color : "black";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Назад</span>
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">РУЛЕТКА</h1>
          <div className="flex items-center gap-2 mt-1 bg-gray-800 px-4 py-2 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <div className="font-semibold text-sm">
              ${points.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Игровая зона */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6">
        {/* Барабан с числами */}
        <div className="bg-gray-900 rounded-lg p-6 mb-4 border border-gray-600">
          <div className="text-center mb-4">
            <div className="text-gray-400 text-sm mb-6">Результат:</div>

            {isSpinning ? (
              // Анимация вращения
              <div className="flex justify-center items-center gap-2 h-16">
                {displayedNumbers.map((number, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border-2 ${getColorClass(
                      getWinningNumberColor(number)
                    )} border-white/30 animate-pulse`}
                  >
                    {number}
                  </div>
                ))}
              </div>
            ) : winningNumber ? (
              // Финальный результат
              <div className="flex justify-center">
                <div
                  className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold text-2xl border-4 ${getColorClass(
                    winningColor || "black"
                  )} border-white/50 shadow-lg animate-bounce`}
                >
                  {winningNumber}
                </div>
              </div>
            ) : (
              // Стартовый экран
              <div className="h-16 flex items-center justify-center">
                <div className="text-gray-500 text-lg">
                  Выберите ставку и нажмите "Крутить"
                </div>
              </div>
            )}
          </div>

          {/* Индикатор цвета */}
          {winningColor && (
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700">
                <span className="text-gray-400">Цвет:</span>
                <span
                  className={`font-bold ${
                    winningColor === "red"
                      ? "text-red-400"
                      : winningColor === "black"
                      ? "text-gray-300"
                      : "text-green-400"
                  }`}
                >
                  {winningColor === "red"
                    ? "🔴 Красный"
                    : winningColor === "black"
                    ? "⚫ Черный"
                    : "🟢 Зеленый"}
                </span>
              </div>
            </div>
          )}
        </div>

        {gameResult && (
          <div
            className={`text-center font-bold mb-4 ${
              gameResult === "win" ? "text-green-400" : "text-red-400"
            }`}
          >
            {gameResult === "win" && (
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>ПОБЕДА! +${pointsWon}</span>
              </div>
            )}
            {gameResult === "loss" && (
              <div className="flex items-center justify-center gap-2">
                <Target className="w-5 h-5 text-orange-400" />
                <span>ПРОИГРЫШ -${entryPoints}</span>
              </div>
            )}
          </div>
        )}

        {/* Кнопка вращения */}
        <button
          onClick={spinRoulette}
          disabled={isSpinning || !selectedBet || entryPoints > points}
          className={`w-full py-3 rounded-lg font-bold transition-all text-sm ${
            isSpinning || !selectedBet || entryPoints > points
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500 active:scale-95"
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

      {/* Выбор ставки */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
        <div className="text-gray-400 text-sm mb-3">Тип ставки</div>
        <div className="grid grid-cols-2 gap-2">
          {betOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleBetSelect(option.type)}
              className={`p-3 rounded-lg border transition-all text-left ${
                selectedBet === option.type
                  ? "bg-green-600 border-green-400"
                  : "bg-gray-700 border-gray-600 hover:bg-gray-600"
              }`}
            >
              <div className="font-semibold text-sm">{option.label}</div>
              <div className="text-gray-400 text-xs">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Выбор числа */}
      {selectedBet === "number" && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
          <div className="text-gray-400 text-sm mb-3">Выберите число</div>
          <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto">
            {rouletteNumbers.map((item) => (
              <button
                key={item.number}
                onClick={() => setSelectedNumber(item.number)}
                className={`p-2 rounded border transition-all ${getColorClass(
                  item.color
                )} ${
                  selectedNumber === item.number
                    ? "ring-2 ring-yellow-400"
                    : "hover:opacity-80"
                }`}
              >
                <span className="text-xs">{item.number}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Управление ставкой */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-sm">Ставка</span>
            <span className="font-bold text-sm flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />${entryPoints}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {bet.fast.map((amount) => (
              <button
                key={amount}
                onClick={() => setEntryPoints(amount)}
                className={`py-2 rounded-lg border transition-all text-xs ${
                  entryPoints === amount
                    ? "bg-green-600 border-green-400"
                    : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                }`}
              >
                ${amount}
              </button>
            ))}
            <button
              onClick={setMaxEntry}
              className="py-2 rounded-lg border border-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/30 transition-all text-xs"
            >
              МАКС
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => increaseEntry(bet.increase[0])}
              className="py-2 bg-green-600 border border-green-500 rounded-lg hover:bg-green-500 transition-all text-xs"
            >
              +${bet.increase[0]}
            </button>
            <button
              onClick={() => increaseEntry(bet.increase[1])}
              className="py-2 bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-500 transition-all text-xs"
            >
              +${bet.increase[1]}
            </button>
          </div>
        </div>

        {selectedBet && (
          <div className="text-center text-gray-400 text-xs">
            Множитель:{" "}
            <span className="text-yellow-400 font-bold">
              x{getCurrentMultiplier()}
            </span>{" "}
            • Возможный выигрыш:{" "}
            <span className="text-green-400 font-bold">
              +${(entryPoints * (getCurrentMultiplier() - 1)).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Предупреждение */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="text-yellow-400 text-xs text-center">
          ⚠️ Для развлекательных целей
        </div>
      </div>
    </div>
  );
};
