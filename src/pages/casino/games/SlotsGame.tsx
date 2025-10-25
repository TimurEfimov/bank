import React, { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";

export interface SlotsGameProps {
  balance: number;
  setBalance: (balance: number) => void;
  onBack: () => void;
  onGameResult: (
    result: "win" | "loss",
    amount: number,
    newBalance: number
  ) => void;
}

const symbols = ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐", "💎", "7️⃣"];

export const SlotsGame: React.FC<SlotsGameProps> = ({
  balance,
  setBalance,
  onBack,
  onGameResult,
}) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [reels, setReels] = useState<number[]>([0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null);
  const [winAmount, setWinAmount] = useState<number>(0);

  const spinReels = () => {
    if (isSpinning || betAmount > balance) return;

    setIsSpinning(true);
    setGameResult(null);

    let spins = 0;
    const maxSpins = 20;
    const spinInterval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
      ]);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(spinInterval);

        const finalReels = [
          Math.floor(Math.random() * symbols.length),
          Math.floor(Math.random() * symbols.length),
          Math.floor(Math.random() * symbols.length),
        ];

        setReels(finalReels);
        setIsSpinning(false);

        // Проверяем выигрыш
        if (
          finalReels[0] === finalReels[1] &&
          finalReels[1] === finalReels[2]
        ) {
          const win = betAmount * 5; // x5 за три одинаковых символа
          setGameResult("win");
          setWinAmount(win);
          const newBalance = balance + win;
          setBalance(newBalance);
          onGameResult("win", win, newBalance);
        } else if (
          finalReels[0] === finalReels[1] ||
          finalReels[1] === finalReels[2]
        ) {
          const win = betAmount * 2; // x2 за два одинаковых символа
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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white p-4">
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
          <h1 className="text-2xl font-bold">Слоты</h1>
          <div className="text-white/60 text-sm">
            Баланс: {balance.toLocaleString()} ₽
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Slot Machine */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
        <div className="bg-black/50 rounded-xl p-6 mb-6 border-2 border-yellow-500/30">
          <div className="flex justify-center items-center gap-4 text-4xl font-bold">
            {reels.map((reel, index) => (
              <div
                key={index}
                className="w-20 h-20 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border-2 border-yellow-500/20"
              >
                {symbols[reel]}
              </div>
            ))}
          </div>
        </div>

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
          onClick={spinReels}
          disabled={isSpinning || betAmount > balance}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            isSpinning || betAmount > balance
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          }`}
        >
          {isSpinning ? "Крутим..." : "Крутить"}
        </button>
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
                    ? "bg-blue-600 border-blue-400"
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
          Выигрыши: x2 за 2 символа, x5 за 3 символа
        </div>
      </div>
    </div>
  );
};
