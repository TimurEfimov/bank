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

const symbols = ["✨", "🔥", "👑", "💫", "⭐", "💎", "🍀", "⚡"];

export const SlotsGame: React.FC<GamesProps> = ({
  points,
  setPoints,
  onBack,
  onGameResult,
  bet,
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
    const maxSpins = 12;
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
          // ВЫИГРЫШ: 3 одинаковых символа
          const winAmount = entryPoints * 3;
          setGameResult("win");
          setPointsWon(winAmount);
          const newPoints = points + winAmount;
          setPoints(newPoints);
          onGameResult("win", winAmount, newPoints);
        } else if (
          finalReels[0] === finalReels[1] ||
          finalReels[1] === finalReels[2]
        ) {
          // ВЫИГРЫШ: 2 одинаковых символа
          const winAmount = entryPoints;
          setGameResult("win");
          setPointsWon(winAmount);
          const newPoints = points + winAmount;
          setPoints(newPoints);
          onGameResult("win", winAmount, newPoints);
        } else {
          // ПРОИГРЫШ
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
    setEntryPoints(Math.min(points, bet.max));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 relative">
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
          <h1 className="text-xl font-bold text-white">СЛОТЫ</h1>
          <div className="flex items-center gap-2 mt-1 bg-gray-800 px-4 py-2 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <div className="font-semibold text-sm">
              ${points.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Slot Machine */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-600">
          <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
            <div className="flex justify-center items-center gap-3">
              {reels.map((reel, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600 transition-all ${
                    isSpinning ? "animate-pulse" : ""
                  } ${
                    gameResult === "win"
                      ? "border-green-500"
                      : gameResult === "loss"
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <div
                    className={`text-3xl ${
                      isSpinning ? "opacity-70" : "opacity-100"
                    }`}
                  >
                    {symbols[reel]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result */}
          {gameResult && (
            <div
              className={`text-center mb-4 ${
                gameResult === "win" ? "text-green-400" : "text-red-400"
              }`}
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                  gameResult === "win" ? "bg-green-500/20" : "bg-red-500/20"
                }`}
              >
                {gameResult === "win" ? (
                  <>
                    <Trophy className="w-5 h-5" />
                    <div>
                      <div className="font-bold">ПОБЕДА!</div>
                      <div className="text-sm">+${pointsWon}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    <div>
                      <div className="font-bold">ПРОИГРЫШ</div>
                      <div className="text-sm">-${pointsWon}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Spin Button */}
          <button
            onClick={spinReels}
            disabled={isSpinning || entryPoints > points}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              isSpinning || entryPoints > points
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 active:scale-95"
            }`}
          >
            {isSpinning ? (
              <div className="flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>ВРАЩЕНИЕ...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                <span>КРУТИТЬ</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Bet Controls */}
      <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-4 border border-gray-600">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 text-sm font-medium">СТАВКА</span>
            <div className="bg-blue-600 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
              <Star className="w-3 h-3" />${entryPoints}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-2">
            {bet.fast.map((amount) => (
              <button
                key={amount}
                onClick={() => setEntryPoints(amount)}
                className={`py-2 rounded-lg border transition-all text-xs ${
                  entryPoints === amount
                    ? "bg-blue-600 border-blue-400"
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

        {/* Rules */}
        <div className="flex flex-col gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>2 символа: ${entryPoints} выигрыш</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>3 символа: ${entryPoints * 3} выигрыш</span>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg max-w-md mx-auto">
        <div className="text-yellow-400 text-xs text-center">
          ⚠️ Для развлекательных целей
        </div>
      </div>
    </div>
  );
};
