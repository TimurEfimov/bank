import React, { useState } from "react";
import { ArrowLeft, RotateCcw, Trophy, Star, Zap, Target } from "lucide-react";
import type { GamesProps } from "../Games";

export interface SlotsGameProps {
  points: number;
  setPoints: (points: number) => void;
  onBack: () => void;
  onGameResult: (
    result: "win" | "loss",
    pointsChange: number,
    newPoints: number
  ) => void;
}

// Красивые emoji-символы премиум качества
const symbols = ["✨", "🔥", "👑", "💫", "⭐", "💎", "🍀", "⚡"];

export const SlotsGame: React.FC<GamesProps> = ({
  points,
  setPoints,
  onBack,
  onGameResult,
  bet
}) => {
  const [entryPoints, setEntryPoints] = useState<number>(bet.min);
  const [reels, setReels] = useState<number[]>([0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null);
  const [pointsWon, setPointsWon] = useState<number>(0);

  const spinReels = () => {
    if (isSpinning || entryPoints > points) return;

    setIsSpinning(true);
    setGameResult(null);

    let spins = 0;
    const maxSpins = 15;
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
          const pointsChange = entryPoints * 4; // Чистый выигрыш
          setGameResult("win");
          setPointsWon(pointsChange);
          const newPoints = points + pointsChange;
          setPoints(newPoints);
          onGameResult("win", pointsChange, newPoints);
        } else if (
          finalReels[0] === finalReels[1] ||
          finalReels[1] === finalReels[2]
        ) {
          const pointsChange = entryPoints; // Чистый выигрыш
          setGameResult("win");
          setPointsWon(pointsChange);
          const newPoints = points + pointsChange;
          setPoints(newPoints);
          onGameResult("win", pointsChange, newPoints);
        } else {
          setGameResult("loss");
          setPointsWon(entryPoints);
          const newPoints = points - entryPoints;
          setPoints(newPoints);
          onGameResult("loss", entryPoints, newPoints);
        }
      }
    }, 80);
  };

  const increaseEntry = (amount: number) => {
    const newEntry = entryPoints + amount;
    if (newEntry <= points) {
      setEntryPoints(newEntry);
    }
  };

  const setMaxEntry = () => {
    setEntryPoints(Math.min(points, bet.max)); // Ограничиваем максимальную ставку
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-4 relative overflow-hidden">
      {/* Анимированный фон с частицами */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4 md:mb-8 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 z-20 relative"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Назад</span>
        </button>
        <div className="text-center z-10">
          <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            УДАЧА
          </h1>
          <div className="flex items-center gap-2 mt-1 md:mt-2 bg-black/40 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full border border-white/10">
            <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
            <div className="font-semibold text-sm md:text-base">
              {points.toLocaleString()} очков
            </div>
          </div>
        </div>
        <div className="w-8 md:w-10"></div>
      </div>

      {/* Slot Machine */}
      <div className="relative mb-4 md:mb-8 max-w-2xl mx-auto z-10 px-2">
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl md:rounded-3xl p-4 md:p-8 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          {/* Декоративные элементы */}
          <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 w-24 md:w-40 h-1 md:h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-sm z-0"></div>

          <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-xl md:rounded-2xl p-4 md:p-8 mb-4 md:mb-8 border-2 border-cyan-400/40 shadow-inner z-10">
            <div className="flex justify-center items-center gap-2 md:gap-6">
              {reels.map((reel, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 md:w-32 md:h-32 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg md:rounded-2xl flex items-center justify-center border-2 md:border-4 border-cyan-500/30 shadow-lg md:shadow-2xl transition-all duration-200 ${
                    isSpinning ? "animate-pulse" : ""
                  }`}
                >
                  {/* Свечение при выигрыше */}
                  {gameResult === "win" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-lg md:rounded-2xl animate-pulse"></div>
                  )}

                  <div
                    className={`text-3xl md:text-6xl transition-all duration-150 ${
                      isSpinning ? "opacity-70" : "opacity-100"
                    }`}
                  >
                    {symbols[reel]}
                  </div>

                  {/* Блеск */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Result - Премиум дизайн */}
          {gameResult && (
            <div
              className={`text-center mb-4 md:mb-6 animate-scale-in z-10 ${
                gameResult === "win" ? "text-green-400" : "text-red-400"
              }`}
            >
              <div
                className={`inline-flex items-center gap-2 md:gap-4 px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl backdrop-blur-sm border-2 ${
                  gameResult === "win"
                    ? "bg-green-500/10 border-green-400/30 shadow-lg shadow-green-500/20"
                    : "bg-red-500/10 border-red-400/30 shadow-lg shadow-red-500/20"
                }`}
              >
                {gameResult === "win" ? (
                  <>
                    <Trophy className="w-5 h-5 md:w-8 md:h-8 text-yellow-400 animate-bounce" />
                    <div>
                      <div className="text-lg md:text-2xl font-bold">
                        ПОБЕДА!
                      </div>
                      <div className="text-sm md:text-lg font-semibold">
                        +{pointsWon} очков
                      </div>
                    </div>
                    <Star className="w-5 h-5 md:w-8 md:h-8 text-yellow-400 animate-pulse" />
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 md:w-8 md:h-8 text-orange-400" />
                    <div>
                      <div className="text-lg md:text-2xl font-bold">
                        ПРОИГРЫШ
                      </div>
                      <div className="text-sm md:text-lg font-semibold">
                        -{pointsWon} очков
                      </div>
                    </div>
                    <Target className="w-5 h-5 md:w-8 md:h-8 text-orange-400" />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Spin Button */}
          <button
            onClick={spinReels}
            disabled={isSpinning || entryPoints > points}
            className={`relative w-full py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-xl transition-all duration-300 transform z-10 ${
              isSpinning || entryPoints > points
                ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 active:scale-95 shadow-lg shadow-cyan-500/30"
            }`}
          >
            {isSpinning ? (
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <RotateCcw className="w-4 h-4 md:w-6 md:h-6 animate-spin" />
                <span className="text-sm md:text-base">ВРАЩЕНИЕ...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <Zap className="w-4 h-4 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">КРУТИТЬ</span>
                <Zap className="w-4 h-4 md:w-6 md:h-6" />
              </div>
            )}

            {/* Свечение кнопки */}
            {!(isSpinning || entryPoints > points) && (
              <div className="absolute inset-0 bg-cyan-400/20 rounded-xl md:rounded-2xl blur-md animate-pulse z-0"></div>
            )}
          </button>
        </div>
      </div>

      {/* Entry Points Controls */}
      <div className="relative max-w-2xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 z-10 px-2">
        <div className="mb-4 md:mb-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <span className="text-white/70 text-base md:text-lg font-semibold">
              СТОИМОСТЬ УЧАСТИЯ
            </span>
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 px-3 py-2 md:px-6 md:py-3 rounded-full font-bold text-lg md:text-xl shadow-lg flex items-center gap-2">
              <Star className="w-4 h-4 md:w-5 md:h-5" />
              {entryPoints.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
            {bet.fast.map((amount) => (
              <button
                key={amount}
                onClick={() => setEntryPoints(amount)}
                className={`py-2 md:py-4 rounded-lg md:rounded-xl border-2 transition-all duration-300 font-semibold text-sm md:text-base z-10 relative ${
                  entryPoints === amount
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 shadow-lg shadow-cyan-500/30"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {amount}
              </button>
            ))}
            <button
              onClick={setMaxEntry}
              className="py-2 md:py-4 rounded-lg md:rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 font-semibold text-sm md:text-base z-10 relative"
            >
              MAX
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button
              onClick={() => increaseEntry(bet.increase[0])}
              className="py-2 md:py-4 bg-gradient-to-r from-green-600 to-emerald-600 border-2 border-green-400 rounded-lg md:rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 font-semibold text-sm md:text-base z-10 relative"
            >
              +{bet.increase[0]}
            </button>
            <button
              onClick={() => increaseEntry(bet.increase[1])}
              className="py-2 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-cyan-400 rounded-lg md:rounded-xl hover:from-blue-1000 hover:to-cyan-500 transition-all duration-300 font-semibold text-sm md:text-base z-10 relative"
            >
              +{bet.increase[1]}
            </button>
          </div>
        </div>

        {/* Правила в стиле баджиков */}
        <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-6 z-10">
          <div className="flex items-center justify-center gap-2 bg-cyan-500/10 px-3 py-1 md:px-4 md:py-2 rounded-full border border-cyan-400/30">
            <Star className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
            <span className="text-xs md:text-sm font-semibold">
              2 символа: +{entryPoints} очков
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-purple-500/10 px-3 py-1 md:px-4 md:py-2 rounded-full border border-purple-400/30">
            <Trophy className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
            <span className="text-xs md:text-sm font-semibold">
              3 символа: +{entryPoints * 4} очков
            </span>
          </div>
        </div>
      </div>

      {/* Предупреждение */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl max-w-2xl mx-auto">
        <div className="text-yellow-400 text-xs text-center">
          ⚠️ Игра предназначена для развлечения. Игровые очки не имеют денежной
          стоимости.
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl z-0"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl z-0"></div>
    </div>
  );
};
