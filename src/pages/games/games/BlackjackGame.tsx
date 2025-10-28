import React, { useState } from "react";
import {
  ArrowLeft,
  Crown,
  Trophy,
  Zap,
  Shield,
  Star,
  Target,
} from "lucide-react";
import type { GamesProps } from "../Games";



const cardValues = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const cardSuits = ["♠", "♥", "♦", "♣"];

export const BlackjackGame: React.FC<GamesProps> = ({
  points,
  setPoints,
  onBack,
  onGameResult,
  bet
}) => {
  const [entryPoints, setEntryPoints] = useState<number>(bet.min);
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [gameState, setGameState] = useState<
    "selecting" | "player-turn" | "dealer-turn" | "finished"
  >("selecting");
  const [gameResult, setGameResult] = useState<"win" | "loss" | "push" | null>(
    null
  );
  const [pointsWon, setPointsWon] = useState<number>(0);

  const getRandomCard = (): string => {
    const value = cardValues[Math.floor(Math.random() * cardValues.length)];
    const suit = cardSuits[Math.floor(Math.random() * cardSuits.length)];
    return `${value}${suit}`;
  };

  const calculateHandValue = (hand: string[]): number => {
    let value = 0;
    let aces = 0;

    hand.forEach((card) => {
      const cardValue = card.slice(0, -1);
      if (["J", "Q", "K"].includes(cardValue)) {
        value += 10;
      } else if (cardValue === "A") {
        aces += 1;
        value += 11;
      } else {
        value += parseInt(cardValue);
      }
    });

    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  };

  const startGame = () => {
    if (entryPoints > points) return;

    const newPlayerCards = [getRandomCard(), getRandomCard()];
    const newDealerCards = [getRandomCard(), getRandomCard()];

    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setGameState("player-turn");
    setGameResult(null);

    const playerValue = calculateHandValue(newPlayerCards);
    if (playerValue === 21) {
      setTimeout(() => {
        const dealerValue = calculateHandValue(newDealerCards);
        if (dealerValue === 21) {
          endGame("push");
        } else {
          endGame("win");
        }
      }, 1000);
    }
  };

  const playerHit = () => {
    const newPlayerCards = [...playerCards, getRandomCard()];
    setPlayerCards(newPlayerCards);

    const playerValue = calculateHandValue(newPlayerCards);
    if (playerValue > 21) {
      endGame("loss");
    } else if (playerValue === 21) {
      setTimeout(() => {
        setGameState("dealer-turn");
        dealerPlay();
      }, 500);
    }
  };

  const playerStand = () => {
    setGameState("dealer-turn");
    dealerPlay();
  };

  const dealerPlay = () => {
    let newDealerCards = [...dealerCards];
    let dealerValue = calculateHandValue(newDealerCards);

    while (dealerValue < 17) {
      newDealerCards = [...newDealerCards, getRandomCard()];
      dealerValue = calculateHandValue(newDealerCards);
    }

    setDealerCards(newDealerCards);

    setTimeout(() => {
      endGame(null);
    }, 1000);
  };

  const endGame = (forcedResult: "win" | "loss" | "push" | null) => {
    let finalResult: "win" | "loss" | "push";
    let finalPointsChange = 0;

    if (forcedResult) {
      finalResult = forcedResult;
    } else {
      const playerValue = calculateHandValue(playerCards);
      const dealerValue = calculateHandValue(dealerCards);

      if (playerValue > 21) {
        finalResult = "loss";
      } else if (dealerValue > 21) {
        finalResult = "win";
      } else if (playerValue > dealerValue) {
        finalResult = "win";
      } else if (playerValue < dealerValue) {
        finalResult = "loss";
      } else {
        finalResult = "push";
      }
    }

    setGameResult(finalResult);
    setGameState("finished");

    if (finalResult === "win") {
      finalPointsChange = entryPoints;
      const newPoints = points + finalPointsChange;
      setPointsWon(finalPointsChange);
      setPoints(newPoints);
      onGameResult("win", finalPointsChange, newPoints);
    } else if (finalResult === "loss") {
      finalPointsChange = entryPoints;
      const newPoints = points - finalPointsChange;
      setPointsWon(finalPointsChange);
      setPoints(newPoints);
      onGameResult("loss", finalPointsChange, newPoints);
    } else {
      setPointsWon(0);
    }
  };

  const resetGame = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setGameState("selecting");
    setGameResult(null);
    setPointsWon(0);
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

  const playerValue = calculateHandValue(playerCards);
  const dealerValue = calculateHandValue(dealerCards);

  const getCardColor = (card: string) => {
    const suit = card.slice(-1);
    return suit === "♥" || suit === "♦" ? "text-red-500" : "text-white";
  };

  const getSuitColor = (suit: string) => {
    return suit === "♥" || suit === "♦" ? "text-red-400" : "text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-green-950 text-white p-3 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-green-500/10 animate-pulse"></div>

      {/* Компактный Header */}
      <div className="relative flex items-center justify-between mb-4 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Назад</span>
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            21 ОЧКО
          </h1>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <div className="font-semibold text-sm">
              {points.toLocaleString()} очков
            </div>
          </div>
        </div>
        <div className="w-2"></div>
      </div>

      {/* Основная игровая зона */}
      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/20 mb-3">
        {/* Dealer's Hand */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <div className="text-white/70 text-sm font-semibold">ДИЛЛЕР</div>
            </div>
            {gameState !== "selecting" && (
              <div className="bg-red-500/10 border border-red-400/30 px-2 py-1 rounded-full">
                <div className="text-red-300 font-bold text-sm">
                  {dealerValue}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-center overflow-x-auto py-1">
            {dealerCards.map((card, index) => (
              <div
                key={index}
                className={`relative w-12 h-16 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg flex flex-col items-center justify-center border border-red-500/30 shadow-md flex-shrink-0 ${
                  index > 0 && gameState === "player-turn" ? "opacity-70" : ""
                }`}
              >
                <div className={`text-sm font-bold ${getCardColor(card)}`}>
                  {card.slice(0, -1)}
                </div>
                <div
                  className={`text-xs ${getSuitColor(
                    card.slice(-1)
                  )} absolute bottom-1`}
                >
                  {card.slice(-1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Разделитель */}
        <div className="flex justify-center mb-4">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
        </div>

        {/* Player's Hand */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-cyan-400" />
              <div className="text-white/70 text-sm font-semibold">ВЫ</div>
            </div>
            {gameState !== "selecting" && (
              <div
                className={`px-2 py-1 rounded-full border text-sm ${
                  playerValue > 21
                    ? "bg-red-500/10 border-red-400/30 text-red-300"
                    : playerValue === 21
                    ? "bg-yellow-500/10 border-yellow-400/30 text-yellow-300"
                    : "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"
                }`}
              >
                <div className="font-bold">{playerValue}</div>
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-center overflow-x-auto py-1">
            {playerCards.map((card, index) => (
              <div
                key={index}
                className={`relative w-12 h-16 bg-gradient-to-b from-cyan-600 to-blue-700 rounded-lg flex flex-col items-center justify-center border border-cyan-400/30 shadow-md flex-shrink-0 ${
                  index === playerCards.length - 1 ? "animate-pulse" : ""
                }`}
              >
                <div className={`text-sm font-bold ${getCardColor(card)}`}>
                  {card.slice(0, -1)}
                </div>
                <div
                  className={`text-xs ${getSuitColor(
                    card.slice(-1)
                  )} absolute bottom-1`}
                >
                  {card.slice(-1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Controls */}
        {gameState === "selecting" && (
          <button
            onClick={startGame}
            disabled={entryPoints > points}
            className={`w-full py-3 rounded-xl font-bold transition-all duration-200 text-sm ${
              entryPoints > points
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-95"
            }`}
          >
            НАЧАТЬ ИГРУ
          </button>
        )}

        {gameState === "player-turn" && (
          <div className="flex gap-2">
            <button
              onClick={playerHit}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-bold transition-all duration-200 active:scale-95 text-sm"
            >
              ЕЩЕ КАРТУ
            </button>
            <button
              onClick={playerStand}
              className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg font-bold transition-all duration-200 active:scale-95 text-sm"
            >
              ДОСТАТОЧНО
            </button>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center">
            {gameResult && (
              <div
                className={`mb-3 ${
                  gameResult === "win"
                    ? "text-green-400"
                    : gameResult === "loss"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border text-sm ${
                    gameResult === "win"
                      ? "bg-green-500/10 border-green-400/30"
                      : gameResult === "loss"
                      ? "bg-red-500/10 border-red-400/30"
                      : "bg-yellow-500/10 border-yellow-400/30"
                  }`}
                >
                  {gameResult === "win" ? (
                    <>
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <div>
                        <div className="font-bold">ПОБЕДА!</div>
                        <div>+{pointsWon} очков</div>
                      </div>
                    </>
                  ) : gameResult === "loss" ? (
                    <>
                      <Zap className="w-4 h-4 text-orange-400" />
                      <div>
                        <div className="font-bold">ПРОИГРЫШ</div>
                        <div>-{pointsWon} очков</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-yellow-400" />
                      <div>
                        <div className="font-bold">НИЧЬЯ</div>
                        <div>Очки сохранены</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={resetGame}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-lg font-bold transition-all duration-200 active:scale-95 text-sm"
            >
              ИГРАТЬ СНОВА
            </button>
          </div>
        )}
      </div>

      {/* Entry Points Controls */}
      {gameState === "selecting" && (
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-green-500/30 shadow-lg shadow-green-500/20">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/70 text-sm font-semibold">
                СТОИМОСТЬ УЧАСТИЯ
              </span>
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                <Star className="w-3 h-3" />
                {entryPoints.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {bet.fast.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setEntryPoints(amount)}
                  className={`py-2 rounded-lg border transition-all duration-200 text-xs font-semibold ${
                    entryPoints === amount
                      ? "bg-gradient-to-r from-emerald-600 to-blue-600 border-emerald-400"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {amount}
                </button>
              ))}
              <button
                onClick={setMaxEntry}
                className="py-2 rounded-lg border border-yellow-400 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-200 text-xs font-semibold"
              >
                MAX
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => increaseEntry(bet.increase[0])}
                className="py-2 bg-gradient-to-r from-green-600 to-emerald-600 border border-green-400 rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-200 text-xs font-semibold"
              >
                +{bet.increase[0]}
              </button>
              <button
                onClick={() => increaseEntry(bet.increase[1])}
                className="py-2 bg-gradient-to-r from-blue-600 to-cyan-600 border border-cyan-400 rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 text-xs font-semibold"
              >
                +{bet.increase[1]}
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
              <Target className="w-3 h-3 text-emerald-300" />
              <div className="text-emerald-300 font-semibold text-xs">
                Цель: 21 очко
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full"></div>
              <div className="text-cyan-300 font-semibold text-xs">
                Победа: +{entryPoints} очков
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Статус игры */}
      {gameState !== "selecting" && (
        <div className="text-center mt-2">
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
            <div className="text-white/60 text-xs">
              {gameState === "player-turn" &&
                "Ваш ход - берите карты или остановитесь"}
              {gameState === "dealer-turn" && "Ход дилера..."}
              {gameState === "finished" && "Игра завершена"}
            </div>
          </div>
        </div>
      )}

      {/* Декоративные элементы */}
      <div className="absolute top-5 left-5 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-5 right-5 w-16 h-16 bg-green-500/10 rounded-full blur-xl"></div>
    </div>
  );
};
