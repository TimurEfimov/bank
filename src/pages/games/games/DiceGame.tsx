import React, { useState } from "react";
import {
  Dice5,
  ArrowLeft,
  RotateCcw,
  Crown,
  Trophy,
  Zap,
  Target,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 text-white p-4 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-8 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 z-20"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            DICE DUEL
          </h1>
          <div className="flex items-center gap-2 mt-2 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
            <Crown className="w-4 h-4 text-yellow-400" />
            <div className="font-semibold">
              Баланс: {balance.toLocaleString()} ₽
            </div>
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Game Area */}
      <div className="relative max-w-4xl mx-auto mb-8">
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-8 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          {/* Декоративная полоса */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full blur-sm"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Игрок */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Target className="w-5 h-5 text-cyan-400" />
                <div className="text-white/70 text-lg font-semibold">ВЫ</div>
              </div>
              <div className="relative">
                <div
                  className={`text-8xl mb-4 transform transition-all duration-300 ${
                    isRolling ? "scale-110 rotate-12" : "scale-100"
                  }`}
                >
                  {diceFaces[playerDice - 1]}
                </div>
                <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-2xl py-3 px-6 backdrop-blur-sm">
                  <div className="text-cyan-300 font-bold text-xl">
                    Кость: {playerDice}
                  </div>
                </div>
              </div>
            </div>

            {/* VS разделитель
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-gradient-to-r from-cyan-500 to-pink-500 px-6 py-3 rounded-full border-2 border-white/20 shadow-lg">
                <div className="font-bold text-lg">VS</div>
              </div>
            </div> */}

            {/* Компьютер */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-white/70 text-lg font-semibold">
                  КОМПЬЮТЕР
                </div>
                <Zap className="w-5 h-5 text-pink-400" />
              </div>
              <div className="relative">
                <div
                  className={`text-8xl mb-4 transform transition-all duration-300 ${
                    isRolling ? "scale-110 -rotate-12" : "scale-100"
                  }`}
                >
                  {diceFaces[computerDice - 1]}
                </div>
                <div className="bg-pink-500/10 border border-pink-400/30 rounded-2xl py-3 px-6 backdrop-blur-sm">
                  <div className="text-pink-300 font-bold text-xl">
                    Кость: {computerDice}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result */}
          {gameResult && (
            <div
              className={`text-center mb-6 animate-scale-in ${
                gameResult === "win"
                  ? "text-green-400"
                  : gameResult === "loss"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              <div
                className={`inline-flex items-center gap-4 px-8 py-4 rounded-2xl backdrop-blur-sm border-2 ${
                  gameResult === "win"
                    ? "bg-green-500/10 border-green-400/30 shadow-lg shadow-green-500/20"
                    : gameResult === "loss"
                    ? "bg-red-500/10 border-red-400/30 shadow-lg shadow-red-500/20"
                    : "bg-yellow-500/10 border-yellow-400/30 shadow-lg shadow-yellow-500/20"
                }`}
              >
                {gameResult === "win" ? (
                  <>
                    <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
                    <div>
                      <div className="text-2xl font-bold">ПОБЕДА!</div>
                      <div className="text-lg font-semibold">
                        +{winAmount.toLocaleString()} ₽
                      </div>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
                  </>
                ) : gameResult === "loss" ? (
                  <>
                    <Zap className="w-8 h-8 text-orange-400" />
                    <div>
                      <div className="text-2xl font-bold">ПОПРОБУЙТЕ ЕЩЁ</div>
                      <div className="text-lg font-semibold">
                        -{winAmount.toLocaleString()} ₽
                      </div>
                    </div>
                    <Zap className="w-8 h-8 text-orange-400" />
                  </>
                ) : (
                  <>
                    <Target className="w-8 h-8 text-yellow-400" />
                    <div>
                      <div className="text-2xl font-bold">НИЧЬЯ!</div>
                      <div className="text-lg font-semibold">
                        Ставка возвращена
                      </div>
                    </div>
                    <Target className="w-8 h-8 text-yellow-400" />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Roll Button */}
          <button
            onClick={rollDice}
            disabled={isRolling || betAmount > balance}
            className={`relative w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform ${
              isRolling || betAmount > balance
                ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed scale-95"
                : "bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-500 hover:to-pink-500 hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30"
            }`}
          >
            {isRolling ? (
              <div className="flex items-center justify-center gap-3">
                <RotateCcw className="w-6 h-6 animate-spin" />
                <span>БРОСАЕМ...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Dice5 className="w-6 h-6" />
                <span>БРОСИТЬ КОСТИ</span>
                <Dice5 className="w-6 h-6" />
              </div>
            )}

            {/* Свечение кнопки */}
            {!(isRolling || betAmount > balance) && (
              <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-md animate-pulse"></div>
            )}
          </button>
        </div>
      </div>

      {/* Bet Controls */}
      <div className="relative max-w-2xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-6 border-2 border-pink-500/30 shadow-2xl shadow-pink-500/20">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/70 text-lg font-semibold">СТАВКА</span>
            <div className="bg-gradient-to-r from-cyan-500 to-pink-500 px-6 py-3 rounded-full font-bold text-xl shadow-lg">
              {betAmount.toLocaleString()} ₽
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            {[100, 500, 1000].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 font-semibold ${
                  betAmount === amount
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 shadow-lg shadow-cyan-500/30"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {amount}
              </button>
            ))}
            <button
              onClick={setMaxBet}
              className="py-4 rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              MAX
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => increaseBet(100)}
              className="py-4 bg-gradient-to-r from-green-600 to-emerald-600 border-2 border-green-400 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              +100
            </button>
            <button
              onClick={() => increaseBet(500)}
              className="py-4 bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-cyan-400 rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              +500
            </button>
          </div>
        </div>

        {/* Правила */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 font-semibold">x2 за победу</span>
            </div>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-pink-400" />
              <span className="text-pink-300 font-semibold">
                ничья = возврат
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};
