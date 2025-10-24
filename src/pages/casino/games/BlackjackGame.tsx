import React, { useState } from "react";
import { RotateCcw, Plus, Minus } from "lucide-react";

interface BlackjackGameProps {
  balance: number;
  setBalance: (balance: number) => void;
  onBack: () => void;
}

export const BlackjackGame: React.FC<BlackjackGameProps> = ({
  balance,
  setBalance,
  onBack,
}) => {
  const [bet, setBet] = useState(100);
  const [playerHand, setPlayerHand] = useState<number[]>([]);
  const [dealerHand, setDealerHand] = useState<number[]>([]);
  const [gameState, setGameState] = useState<
    "betting" | "player-turn" | "dealer-turn" | "result"
  >("betting");
  const [result, setResult] = useState<string>("");

  const getCardValue = (card: number): number => {
    return card > 10 ? 10 : card;
  };

  const calculateHand = (hand: number[]): number => {
    let total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    const aces = hand.filter((card) => card === 1).length;

    for (let i = 0; i < aces; i++) {
      if (total + 10 <= 21) total += 10;
    }

    return total;
  };

  const startGame = () => {
    if (bet > balance) return;

    const newBalance = balance - bet;
    setBalance(newBalance);
    const newPlayerHand = [getRandomCard(), getRandomCard()];
    const newDealerHand = [getRandomCard(), getRandomCard()];

    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameState("player-turn");
    setResult("");
  };

  const getRandomCard = (): number => {
    return Math.floor(Math.random() * 13) + 1;
  };

  const hit = () => {
    const newCard = getRandomCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);

    if (calculateHand(newHand) > 21) {
      setGameState("result");
      setResult("Перебор! Вы проиграли");
    }
  };

  const stand = () => {
    setGameState("dealer-turn");
    dealerPlay();
  };

  const dealerPlay = () => {
    let currentDealerHand = [...dealerHand];

    while (calculateHand(currentDealerHand) < 17) {
      currentDealerHand.push(getRandomCard());
    }

    setDealerHand(currentDealerHand);

    const playerTotal = calculateHand(playerHand);
    const dealerTotal = calculateHand(currentDealerHand);

    let gameResult = "";
    let winAmount = 0;

    if (dealerTotal > 21) {
      gameResult = "Дилер перебрал! Вы выиграли";
      winAmount = bet * 2;
    } else if (playerTotal > dealerTotal) {
      gameResult = "Вы выиграли!";
      winAmount = bet * 2;
    } else if (playerTotal < dealerTotal) {
      gameResult = "Дилер выиграл";
    } else {
      gameResult = "Ничья!";
      winAmount = bet;
    }

    if (winAmount > 0) {
      // Используем текущий баланс после вычитания ставки
      const currentBalance = balance - bet;
      setBalance(currentBalance + winAmount);
    }

    setResult(gameResult);
    setGameState("result");
  };

  const renderCard = (card: number, hidden: boolean = false) => {
    if (hidden) {
      return (
        <div className="w-16 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold border-2 border-white/20">
          ?
        </div>
      );
    }

    const suits = ["♠", "♥", "♦", "♣"];
    const suit = suits[Math.floor(card / 13)];
    const value =
      card === 1
        ? "A"
        : card === 11
        ? "J"
        : card === 12
        ? "Q"
        : card === 13
        ? "K"
        : card;

    return (
      <div className="w-16 h-24 bg-white rounded-lg flex flex-col items-center justify-center text-black font-bold border-2 border-gray-300">
        <div className="text-lg">{value}</div>
        <div className="text-sm">{suit}</div>
      </div>
    );
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
          Блэкджек
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
                onClick={() => setBet(Math.max(100, bet - 50))}
                className="p-1 bg-white/10 rounded-lg"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                className="text-xl font-bold text-white bg-transparent border-none outline-none text-center w-20"
                min="100"
                max={balance}
              />
              <button
                onClick={() => setBet(Math.min(balance, bet + 50))}
                className="p-1 bg-white/10 rounded-lg"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Дилер */}
        <div className="mb-8">
          <div className="text-white/60 text-center mb-4">
            Дилер: {gameState !== "betting" && calculateHand(dealerHand)}
          </div>
          <div className="flex justify-center gap-2">
            {dealerHand.map((card, index) =>
              renderCard(card, gameState === "player-turn" && index === 1)
            )}
          </div>
        </div>

        {/* Игрок */}
        <div className="mb-8">
          <div className="text-white/60 text-center mb-4">
            Игрок: {calculateHand(playerHand)}
          </div>
          <div className="flex justify-center gap-2">
            {playerHand.map((card, index) => renderCard(card))}
          </div>
        </div>

        {result && (
          <div
            className={`text-center text-2xl font-bold mb-4 ${
              result.includes("выиграл")
                ? "text-emerald-400"
                : result.includes("проиграл")
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {result}
          </div>
        )}

        <div className="flex gap-3">
          {gameState === "betting" ? (
            <button
              onClick={startGame}
              disabled={bet > balance}
              className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              Начать игру ({bet}₽)
            </button>
          ) : gameState === "player-turn" ? (
            <>
              <button
                onClick={hit}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
              >
                Взять карту
              </button>
              <button
                onClick={stand}
                className="flex-1 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
              >
                Хватит
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setGameState("betting");
                setPlayerHand([]);
                setDealerHand([]);
                setResult("");
              }}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              Новая игра
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
