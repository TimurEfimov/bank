import React, { useState } from "react";
import { RotateCcw, Play, Plus, Minus } from "lucide-react";

interface SlotsGameProps {
  balance: number;
  setBalance: (balance: number) => void;
  onBack: () => void;
}

export const SlotsGame: React.FC<SlotsGameProps> = ({
  balance,
  setBalance,
  onBack,
}) => {
  const [bet, setBet] = useState(50);
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState(["🍒", "🍋", "🍊"]);
  const [result, setResult] = useState<string | null>(null);

  const symbols = ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐", "💎"];

  const increaseBet = () => {
    const newBet = Math.min(balance, bet + 10);
    setBet(newBet);
  };

  const decreaseBet = () => {
    const newBet = Math.max(10, bet - 10);
    setBet(newBet);
  };

  const spin = () => {
    if (isSpinning || bet > balance) return;

    setIsSpinning(true);
    setResult(null);
    const newBalance = balance - bet;
    setBalance(newBalance);

    let spins = 0;
    const spinInterval = setInterval(() => {
      setSlots([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
      spins++;

      if (spins > 15) {
        clearInterval(spinInterval);
        const finalSlots = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ];

        setSlots(finalSlots);
        setIsSpinning(false);

        if (
          finalSlots[0] === finalSlots[1] &&
          finalSlots[1] === finalSlots[2]
        ) {
          const winAmount = bet * 10;
          setBalance(newBalance + winAmount);
          setResult(`ДЖЕКПОТ! +${winAmount}₽`);
        } else if (
          finalSlots[0] === finalSlots[1] ||
          finalSlots[1] === finalSlots[2]
        ) {
          const winAmount = bet * 2;
          setBalance(newBalance + winAmount);
          setResult(`Выигрыш! +${winAmount}₽`);
        } else {
          setResult("Повезет в следующий раз!");
        }
      }
    }, 100);
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
          Игровые Автоматы
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
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={decreaseBet}
                disabled={bet <= 10 || isSpinning}
                className="p-1 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
              <input
                type="number"
                value={bet}
                onChange={(e) =>
                  setBet(
                    Math.max(10, Math.min(balance, Number(e.target.value)))
                  )
                }
                disabled={isSpinning}
                className="text-xl font-bold text-white bg-transparent border-none outline-none text-center w-20"
                min="10"
                max={balance}
              />
              <button
                onClick={increaseBet}
                disabled={bet >= balance || isSpinning}
                className="p-1 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-6 mb-6 border-4 border-purple-500/30">
          <div className="flex justify-center gap-4 mb-6">
            {slots.map((slot, index) => (
              <div
                key={index}
                className={`w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-4xl transition-all duration-200 ${
                  isSpinning ? "animate-pulse" : ""
                }`}
              >
                {slot}
              </div>
            ))}
          </div>

          {result && (
            <div
              className={`text-center text-xl font-bold ${
                result.includes("ДЖЕКПОТ")
                  ? "text-yellow-400 animate-pulse"
                  : result.includes("Выигрыш")
                  ? "text-emerald-400"
                  : "text-white/60"
              }`}
            >
              {result}
            </div>
          )}
        </div>

        <button
          onClick={spin}
          disabled={isSpinning || bet > balance}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2"
        >
          <Play className="w-6 h-6" />
          {isSpinning ? "Вращение..." : `Крутить (${bet}₽)`}
        </button>

        <div className="mt-6 text-center text-white/60 text-sm">
          <div>3 одинаковых символа = x10</div>
          <div>2 одинаковых символа = x2</div>
        </div>
      </div>
    </div>
  );
};
