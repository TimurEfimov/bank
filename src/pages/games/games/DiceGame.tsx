import React, { useState } from "react";
import {
  Dice5,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Zap,
  Target,
  Star,
} from "lucide-react";
import type { GamesProps } from "../Games";

export const DiceGame: React.FC<GamesProps> = ({
  points,
  setPoints,
  onBack,
  onGameResult,
  bet,
}) => {
  const [entryPoints, setEntryPoints] = useState<number>(bet.min);
  const [playerDice, setPlayerDice] = useState<number>(1);
  const [computerDice, setComputerDice] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<"win" | "loss" | "draw" | null>(
    null
  );
  const [pointsWon, setPointsWon] = useState<number>(0);

  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  const rollDice = () => {
    if (isRolling || entryPoints > points) return;

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
          const pointsChange = entryPoints;
          setGameResult("win");
          setPointsWon(pointsChange);
          const newPoints = points + pointsChange;
          setPoints(newPoints);
          onGameResult("win", pointsChange, newPoints);
        } else if (finalPlayerDice < finalComputerDice) {
          setGameResult("loss");
          setPointsWon(entryPoints);
          const newPoints = points - entryPoints;
          setPoints(newPoints);
          onGameResult("loss", entryPoints, newPoints);
        } else {
          setGameResult("draw");
          setPointsWon(0);
        }
      }
    }, 100);
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
          <h1 className="text-xl font-bold text-white">КОСТИ</h1>
          <div className="flex items-center gap-2 mt-1 bg-gray-800 px-4 py-2 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <div className="font-semibold text-sm">
              ${points.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Game Area */}
      <div className="max-w-md mx-auto mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Игрок */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Target className="w-4 h-4 text-blue-400" />
                <div className="text-gray-300 text-sm font-semibold">ВЫ</div>
              </div>
              <div className="relative">
                <div
                  className={`text-6xl mb-3 transform transition-all duration-300 ${
                    isRolling ? "scale-110 rotate-12" : "scale-100"
                  }`}
                >
                  {diceFaces[playerDice - 1]}
                </div>
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg py-2 px-4">
                  <div className="text-blue-300 font-bold text-sm">
                    Значение: {playerDice}
                  </div>
                </div>
              </div>
            </div>

            {/* Компьютер */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="text-gray-300 text-sm font-semibold">
                  СОПЕРНИК
                </div>
                <Zap className="w-4 h-4 text-red-400" />
              </div>
              <div className="relative">
                <div
                  className={`text-6xl mb-3 transform transition-all duration-300 ${
                    isRolling ? "scale-110 -rotate-12" : "scale-100"
                  }`}
                >
                  {diceFaces[computerDice - 1]}
                </div>
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg py-2 px-4">
                  <div className="text-red-300 font-bold text-sm">
                    Значение: {computerDice}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result */}
          {gameResult && (
            <div
              className={`text-center mb-4 ${
                gameResult === "win"
                  ? "text-green-400"
                  : gameResult === "loss"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  gameResult === "win"
                    ? "bg-green-500/20 border border-green-400/30"
                    : gameResult === "loss"
                    ? "bg-red-500/20 border border-red-400/30"
                    : "bg-yellow-500/20 border border-yellow-400/30"
                }`}
              >
                {gameResult === "win" ? (
                  <>
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <div>
                      <div className="font-bold">ПОБЕДА!</div>
                      <div className="text-xs">+${pointsWon}</div>
                    </div>
                  </>
                ) : gameResult === "loss" ? (
                  <>
                    <Zap className="w-4 h-4 text-orange-400" />
                    <div>
                      <div className="font-bold">ПРОИГРЫШ</div>
                      <div className="text-xs">-${pointsWon}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-yellow-400" />
                    <div>
                      <div className="font-bold">НИЧЬЯ!</div>
                      <div className="text-xs">Ставка возвращена</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Roll Button */}
          <button
            onClick={rollDice}
            disabled={isRolling || entryPoints > points}
            className={`w-full py-3 rounded-lg font-bold transition-all text-sm ${
              isRolling || entryPoints > points
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 active:scale-95"
            }`}
          >
            {isRolling ? (
              <div className="flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>БРОСАЕМ...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Dice5 className="w-4 h-4" />
                <span>БРОСИТЬ КОСТИ</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Bet Controls */}
      <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 text-sm font-semibold">СТАВКА</span>
            <div className="bg-green-600 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
              <Star className="w-3 h-3" />${entryPoints}
            </div>
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

        {/* Правила */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-green-400" />
              <span className="text-green-300 font-semibold text-xs">
                Победа: +${entryPoints}
              </span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-300 font-semibold text-xs">
                Ничья = возврат
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
