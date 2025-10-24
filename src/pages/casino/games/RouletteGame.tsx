import React, { useState } from "react";
import { RotateCcw } from "lucide-react";

interface RouletteGameProps {
  balance: number;
  setBalance: (balance: number) => void;
  onBack: () => void;
}

export const RouletteGame: React.FC<RouletteGameProps> = ({
  balance,
  setBalance,
  onBack,
}) => {
  const [bet, setBet] = useState(50);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const spin = () => {
    if (isSpinning || bet > balance || selectedNumber === null) return;

    setIsSpinning(true);
    setResult(null);
    setBalance(balance - bet); // Вычитаем ставку

    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37);
      setResult(winningNumber);
      setIsSpinning(false);
      setHistory((prev) => [winningNumber, ...prev.slice(0, 5)]);

      if (winningNumber === selectedNumber) {
        const winAmount = bet * 36;
        // Используем текущий баланс после вычитания ставки
        setBalance(balance - bet + winAmount);
      }
    }, 2000);
  };

  const numbers = [];
  for (let i = 0; i < 37; i++) {
    numbers.push(i);
  }

  const getNumberColor = (number: number): string => {
    if (number === 0) return "bg-green-500";
    return number % 2 === 0 ? "bg-red-500" : "bg-black";
  };

  return (
    <div className="mx-4 my-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-purple-300/70 mb-4 hover:text-white transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Назад к играм
      </button>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Рулетка
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/20 rounded-xl p-3 text-center">
            <div className="text-white/60 text-sm">Баланс</div>
            <div className="text-xl font-bold text-white">
              {balance.toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 text-center">
            <div className="text-white/60 text-sm">Ставка</div>
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="text-xl font-bold text-white bg-transparent border-none outline-none text-center w-full"
              min="10"
              max={balance}
            />
          </div>
        </div>

        {/* Рулетка */}
        <div className="bg-black/40 rounded-2xl p-6 mb-6 border-4 border-purple-500/30">
          <div
            className={`text-6xl text-center font-bold transition-all duration-1000 ${
              isSpinning ? "animate-spin" : ""
            } ${
              result !== null ? getNumberColor(result) : "bg-gray-600"
            } text-white rounded-full w-32 h-32 mx-auto flex items-center justify-center`}
          >
            {isSpinning ? "🎰" : result !== null ? result : "?"}
          </div>

          {result !== null && selectedNumber !== null && (
            <div className="text-center mt-4">
              <div
                className={`text-xl font-bold ${
                  result === selectedNumber
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {result === selectedNumber
                  ? `ПОБЕДА! +${bet * 36}₽`
                  : "ПРОИГРЫШ"}
              </div>
            </div>
          )}
        </div>

        {/* Выбор номера */}
        <div className="grid grid-cols-6 gap-2 mb-6 max-h-40 overflow-y-auto">
          {numbers.map((number) => (
            <button
              key={number}
              onClick={() => setSelectedNumber(number)}
              disabled={isSpinning}
              className={`p-2 rounded-lg font-bold text-white transition-all ${
                selectedNumber === number
                  ? "ring-2 ring-yellow-400 scale-110"
                  : getNumberColor(number)
              } ${isSpinning ? "opacity-50" : "hover:scale-105"}`}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          onClick={spin}
          disabled={isSpinning || bet > balance || selectedNumber === null}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isSpinning ? "Вращение..." : `Крутить (${bet}₽)`}
        </button>

        {/* История */}
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-3">
            Последние результаты
          </h3>
          <div className="flex gap-2">
            {history.map((number, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getNumberColor(
                  number
                )}`}
              >
                {number}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
