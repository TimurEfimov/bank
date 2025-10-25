import React, { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";

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

const numbers = [
  "0",
  "32",
  "15",
  "19",
  "4",
  "21",
  "2",
  "25",
  "17",
  "34",
  "6",
  "27",
  "13",
  "36",
  "11",
  "30",
  "8",
  "23",
  "10",
  "5",
  "24",
  "16",
  "33",
  "1",
  "20",
  "14",
  "31",
  "9",
  "22",
  "18",
  "29",
  "7",
  "28",
  "12",
  "35",
  "3",
  "26",
];

export const RouletteGame: React.FC<RouletteGameProps> = ({
  balance,
  setBalance,
  onBack,
  onGameResult,
}) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningNumber, setWinningNumber] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null);
  const [winAmount, setWinAmount] = useState<number>(0);

  const spinWheel = () => {
    if (isSpinning || !selectedNumber || betAmount > balance) return;

    setIsSpinning(true);
    setGameResult(null);
    setWinningNumber(null);

    let spins = 0;
    const maxSpins = 30;
    const spinInterval = setInterval(() => {
      setWinningNumber(numbers[Math.floor(Math.random() * numbers.length)]);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(spinInterval);

        const finalNumber = numbers[Math.floor(Math.random() * numbers.length)];
        setWinningNumber(finalNumber);
        setIsSpinning(false);

        // Проверяем результат
        if (finalNumber === selectedNumber) {
          const win = betAmount * 36; // x36 за прямое попадание
          setGameResult("win");
          setWinAmount(win);
          const newBalance = balance + win;
          setBalance(newBalance);
          onGameResult("win", win, newBalance);
        } else {
          setGameResult("loss");
          setWinAmount(betAmount);
          const newBalance = balance - betAmount;
          setBalance(newBalance);
          onGameResult("loss", betAmount, newBalance);
        }
      }
    }, 100);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 to-red-950 text-white p-4">
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

      {/* Roulette Wheel */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex justify-center mb-6">
          <div className="w-64 h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full border-4 border-yellow-500 relative flex items-center justify-center">
            <div className="w-48 h-48 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full border-2 border-yellow-400/50 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full border border-yellow-400/30 flex items-center justify-center">
                {winningNumber && (
                  <div className="text-2xl font-bold text-white">
                    {winningNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Spinner */}
            <div
              className={`absolute top-4 w-4 h-8 bg-red-500 rounded-full transform -translate-y-1/2 transition-transform ${
                isSpinning ? "rotate-180" : ""
              }`}
            ></div>
          </div>
        </div>

        {/* Selected Number */}
        {selectedNumber && (
          <div className="text-center mb-4">
            <div className="text-white/60">Ваш выбор:</div>
            <div className="text-2xl font-bold text-yellow-400">
              {selectedNumber}
            </div>
          </div>
        )}

        {/* Result */}
        {gameResult && (
          <div
            className={`text-center text-xl font-bold mb-4 ${
              gameResult === "win" ? "text-green-400" : "text-red-400"
            }`}
          >
            {gameResult === "win" &&
              `🎉 Вы выиграли ${winAmount.toLocaleString()} ₽!`}
            {gameResult === "loss" &&
              `😞 Вы проиграли ${winAmount.toLocaleString()} ₽`}
          </div>
        )}

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning || !selectedNumber || betAmount > balance}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            isSpinning || !selectedNumber || betAmount > balance
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          }`}
        >
          {isSpinning ? "Крутим..." : "Крутить рулетку"}
        </button>
      </div>

      {/* Number Selection */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
        <div className="text-white/60 text-sm mb-3">Выберите число (0-36)</div>
        <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
          {numbers.map((number) => (
            <button
              key={number}
              onClick={() => setSelectedNumber(number)}
              className={`p-2 rounded-lg border transition-all ${
                selectedNumber === number
                  ? "bg-yellow-600 border-yellow-400"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Bet Controls */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60">Сумма ставки</span>
            <span className="font-bold">{betAmount.toLocaleString()} ₽</span>
          </div>

          <div className="flex gap-2 mb-4">
            {[100, 500, 1000].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`flex-1 py-2 rounded-lg border transition-all ${
                  betAmount === amount
                    ? "bg-orange-600 border-orange-400"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {amount}
              </button>
            ))}
            <button
              onClick={setMaxBet}
              className="flex-1 py-2 rounded-lg border border-yellow-400/30 bg-yellow-400/10 hover:bg-yellow-400/20 transition-all"
            >
              MAX
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => increaseBet(100)}
              className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            >
              +100
            </button>
            <button
              onClick={() => increaseBet(500)}
              className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            >
              +500
            </button>
          </div>
        </div>

        <div className="text-center text-white/60 text-sm">
          Выигрыш: x36 от ставки
        </div>
      </div>
    </div>
  );
};
