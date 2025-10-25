import React, { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";

export interface BlackjackGameProps {
  balance: number;
  setBalance: (balance: number) => void;
  onBack: () => void;
  onGameResult: (
    result: "win" | "loss",
    amount: number,
    newBalance: number
  ) => void;
}

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

export const BlackjackGame: React.FC<BlackjackGameProps> = ({
  balance,
  setBalance,
  onBack,
  onGameResult,
}) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [gameState, setGameState] = useState<
    "betting" | "player-turn" | "dealer-turn" | "finished"
  >("betting");
  const [gameResult, setGameResult] = useState<"win" | "loss" | "push" | null>(
    null
  );
  const [winAmount, setWinAmount] = useState<number>(0);

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

    // Обрабатываем тузы
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  };

  const startGame = () => {
    if (betAmount > balance) return;

    const newPlayerCards = [getRandomCard(), getRandomCard()];
    const newDealerCards = [getRandomCard(), getRandomCard()];

    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setGameState("player-turn");
    setGameResult(null);
  };

  const playerHit = () => {
    const newPlayerCards = [...playerCards, getRandomCard()];
    setPlayerCards(newPlayerCards);

    if (calculateHandValue(newPlayerCards) > 21) {
      endGame("loss");
    }
  };

  const playerStand = () => {
    setGameState("dealer-turn");
    dealerPlay();
  };

  const dealerPlay = () => {
    let newDealerCards = [...dealerCards];

    while (calculateHandValue(newDealerCards) < 17) {
      newDealerCards = [...newDealerCards, getRandomCard()];
    }

    setDealerCards(newDealerCards);
    endGame(null);
  };

  const endGame = (forcedResult: "win" | "loss" | "push" | null) => {
    let finalResult: "win" | "loss" | "push";
    let finalWinAmount = 0;

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

    // Устанавливаем результат игры
    setGameResult(finalResult);
    setGameState("finished");

    // Обновляем баланс в зависимости от результата
    if (finalResult === "win") {
      finalWinAmount = betAmount * 2;
      const newBalance = balance + finalWinAmount;
      setWinAmount(finalWinAmount);
      setBalance(newBalance);
      onGameResult("win", finalWinAmount, newBalance);
    } else if (finalResult === "loss") {
      finalWinAmount = betAmount;
      const newBalance = balance - finalWinAmount;
      setWinAmount(finalWinAmount);
      setBalance(newBalance);
      onGameResult("loss", finalWinAmount, newBalance);
    } else {
      // push - ничья, деньги возвращаются
      setWinAmount(0);
    }
  };

  const resetGame = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setGameState("betting");
    setGameResult(null);
    setWinAmount(0);
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

  const playerValue = calculateHandValue(playerCards);
  const dealerValue = calculateHandValue(dealerCards);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-green-950 text-white p-4">
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
          <h1 className="text-2xl font-bold">Блэкджек</h1>
          <div className="text-white/60 text-sm">
            Баланс: {balance.toLocaleString()} ₽
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Game Area */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
        {/* Dealer's Hand */}
        <div className="mb-8">
          <div className="text-white/60 text-sm mb-2">
            Диллер {gameState !== "betting" && `(${dealerValue})`}
          </div>
          <div className="flex gap-2">
            {dealerCards.map((card, index) => (
              <div
                key={index}
                className="w-16 h-24 bg-gradient-to-b from-red-600 to-red-700 rounded-lg flex items-center justify-center border-2 border-white/20 text-xl font-bold"
              >
                {card}
              </div>
            ))}
          </div>
        </div>

        {/* Player's Hand */}
        <div className="mb-6">
          <div className="text-white/60 text-sm mb-2">
            Вы {gameState !== "betting" && `(${playerValue})`}
          </div>
          <div className="flex gap-2">
            {playerCards.map((card, index) => (
              <div
                key={index}
                className="w-16 h-24 bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg flex items-center justify-center border-2 border-white/20 text-xl font-bold"
              >
                {card}
              </div>
            ))}
          </div>
        </div>

        {/* Game Controls */}
        {gameState === "betting" && (
          <button
            onClick={startGame}
            disabled={betAmount > balance}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              betAmount > balance
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            }`}
          >
            Начать игру
          </button>
        )}

        {gameState === "player-turn" && (
          <div className="flex gap-3">
            <button
              onClick={playerHit}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all"
            >
              Еще карту
            </button>
            <button
              onClick={playerStand}
              className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold transition-all"
            >
              Хватит
            </button>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center">
            <div
              className={`text-xl font-bold mb-4 ${
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
              {gameResult === "push" && "🤝 Ничья! Ставка возвращена"}
            </div>
            <button
              onClick={resetGame}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl font-bold transition-all"
            >
              Новая игра
            </button>
          </div>
        )}
      </div>

      {/* Bet Controls */}
      {gameState === "betting" && (
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
                      ? "bg-emerald-600 border-emerald-400"
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
            Цель: набрать 21 очко или больше дилера
          </div>
        </div>
      )}
    </div>
  );
};
