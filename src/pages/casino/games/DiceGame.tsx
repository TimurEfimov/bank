import React, { useState } from "react";
import { Dice5, ArrowLeft, RotateCcw } from "lucide-react";

export interface DiceGameProps {
  balance: number;
  setBalance: (balance: number) => void;
  onBack: () => void;
  onGameResult: (
    result: "win" | "loss",
    amount: number,
    newBalance: number
  ) => void;
}

export const DiceGame: React.FC<DiceGameProps> = ({
  balance,
  setBalance,
  onBack,
  onGameResult,
}) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [playerDice, setPlayerDice] = useState<number>(1);
  const [computerDice, setComputerDice] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<"win" | "loss" | "draw" | null>(
    null
  );
  const [winAmount, setWinAmount] = useState<number>(0);

  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  const rollDice = () => {
    if (isRolling || betAmount > balance) return;

    setIsRolling(true);
    setGameResult(null);

    let rolls = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
      setPlayerDice(Math.floor(Math.random() * 6) + 1);
      setComputerDice(Math.floor(Math.random() * 6) + 1);
      rolls++;

      if (rolls >= maxRolls) {
        clearInterval(rollInterval);

        const finalPlayerDice = Math.floor(Math.random() * 6) + 1;
        const finalComputerDice = Math.floor(Math.random() * 6) + 1;

        setPlayerDice(finalPlayerDice);
        setComputerDice(finalComputerDice);
        setIsRolling(false);

        // Определяем результат
        if (finalPlayerDice > finalComputerDice) {
          const win = betAmount * 2;
          setGameResult("win");
          setWinAmount(win);
          const newBalance = balance + win;
          setBalance(newBalance);
          onGameResult("win", win, newBalance);
        } else if (finalPlayerDice < finalComputerDice) {
          setGameResult("loss");
          setWinAmount(betAmount);
          const newBalance = balance - betAmount;
          setBalance(newBalance);
          onGameResult("loss", betAmount, newBalance);
        } else {
          setGameResult("draw");
          setWinAmount(0);
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
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 text-white p-4">
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
          <h1 className="text-2xl font-bold">Кости</h1>
          <div className="text-white/60 text-sm">
            Баланс: {balance.toLocaleString()} ₽
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Game Area */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <div className="text-white/60 text-sm mb-2">Вы</div>
            <div className="text-6xl">{diceFaces[playerDice - 1]}</div>
            <div className="text-white/70 mt-2">Кость: {playerDice}</div>
          </div>

          <div className="text-center">
            <div className="text-white/60 text-sm mb-2">Компьютер</div>
            <div className="text-6xl">{diceFaces[computerDice - 1]}</div>
            <div className="text-white/70 mt-2">Кость: {computerDice}</div>
          </div>
        </div>

        {/* Result */}
        {gameResult && (
          <div
            className={`text-center text-xl font-bold mb-4 ${
              gameResult === "win"
                ? "text-green-400"
                : gameResult === "loss"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {gameResult === "win" &&
              `🎉 Вы выиграли ${winAmount.toLocaleString()} ₽!`}
            {gameResult === "loss" &&
              `😞 Вы проиграли ${winAmount.toLocaleString()} ₽`}
            {gameResult === "draw" && "🤝 Ничья!"}
          </div>
        )}

        {/* Roll Button */}
        <button
          onClick={rollDice}
          disabled={isRolling || betAmount > balance}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            isRolling || betAmount > balance
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          }`}
        >
          {isRolling ? "Бросаем..." : "Бросить кости"}
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
                    ? "bg-purple-600 border-purple-400"
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
          Выигрыш: x2 от ставки
        </div>
      </div>
    </div>
  );
};
