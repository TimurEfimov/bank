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
  bet,
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
      finalPointsChange = entryPoints * 2; // Выигрыш 2x от ставки
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
      // Push - возврат ставки
      setPointsWon(0);
      // Очки не меняются
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
    setEntryPoints(Math.min(points, bet.max));
  };

  const playerValue = calculateHandValue(playerCards);
  const dealerValue = calculateHandValue(dealerCards);

  const getCardColor = (card: string) => {
    const suit = card.slice(-1);
    return suit === "♥" || suit === "♦" ? "text-red-500" : "text-white";
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
          <h1 className="text-xl font-bold text-white">БЛЭКДЖЕК</h1>
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
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
        {/* Dealer's Hand */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <div className="text-gray-300 text-sm font-semibold">ДИЛЕР</div>
            </div>
            {gameState !== "selecting" && (
              <div className="bg-red-500/10 border border-red-400/30 px-3 py-1 rounded-full">
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
                className={`w-12 h-16 bg-gray-700 rounded-lg flex flex-col items-center justify-center border border-red-500/30 shadow-md flex-shrink-0 ${
                  index > 0 && gameState === "player-turn" ? "opacity-70" : ""
                }`}
              >
                <div className={`text-sm font-bold ${getCardColor(card)}`}>
                  {card.slice(0, -1)}
                </div>
                <div
                  className={`text-xs ${getCardColor(card)} absolute bottom-1`}
                >
                  {card.slice(-1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-center mb-6">
          <div className="w-full h-px bg-gray-600"></div>
        </div>

        {/* Player's Hand */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-blue-400" />
              <div className="text-gray-300 text-sm font-semibold">ВЫ</div>
            </div>
            {gameState !== "selecting" && (
              <div
                className={`px-3 py-1 rounded-full border text-sm ${
                  playerValue > 21
                    ? "bg-red-500/10 border-red-400/30 text-red-300"
                    : playerValue === 21
                    ? "bg-yellow-500/10 border-yellow-400/30 text-yellow-300"
                    : "bg-blue-500/10 border-blue-400/30 text-blue-300"
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
                className={`w-12 h-16 bg-blue-600 rounded-lg flex flex-col items-center justify-center border border-blue-400/30 shadow-md flex-shrink-0 ${
                  index === playerCards.length - 1 ? "animate-pulse" : ""
                }`}
              >
                <div className={`text-sm font-bold ${getCardColor(card)}`}>
                  {card.slice(0, -1)}
                </div>
                <div
                  className={`text-xs ${getCardColor(card)} absolute bottom-1`}
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
            className={`w-full py-3 rounded-lg font-bold transition-all text-sm ${
              entryPoints > points
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 active:scale-95"
            }`}
          >
            НАЧАТЬ ИГРУ
          </button>
        )}

        {gameState === "player-turn" && (
          <div className="flex gap-2">
            <button
              onClick={playerHit}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-all active:scale-95 text-sm"
            >
              КАРТУ
            </button>
            <button
              onClick={playerStand}
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition-all active:scale-95 text-sm"
            >
              ХВАТИТ
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
                        <div>+${pointsWon}</div>
                      </div>
                    </>
                  ) : gameResult === "loss" ? (
                    <>
                      <Zap className="w-4 h-4 text-orange-400" />
                      <div>
                        <div className="font-bold">ПРОИГРЫШ</div>
                        <div>-${pointsWon}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-yellow-400" />
                      <div>
                        <div className="font-bold">НИЧЬЯ</div>
                        <div>Ставка возвращена</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={resetGame}
              className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-all active:scale-95 text-sm"
            >
              ИГРАТЬ СНОВА
            </button>
          </div>
        )}
      </div>

      {/* Bet Controls */}
      {gameState === "selecting" && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300 text-sm font-semibold">
                СТАВКА
              </span>
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

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-lg border border-gray-600">
              <Target className="w-3 h-3 text-green-300" />
              <div className="text-green-300 font-semibold text-xs">
                Цель: 21
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="text-blue-300 font-semibold text-xs">
                Выигрыш: ${entryPoints * 2}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Status */}
      {gameState !== "selecting" && (
        <div className="text-center mt-3">
          <div className="inline-flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            <div className="text-gray-400 text-xs">
              {gameState === "player-turn" &&
                "Ваш ход - берите карты или остановитесь"}
              {gameState === "dealer-turn" && "Ход дилера..."}
              {gameState === "finished" && "Игра завершена"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
