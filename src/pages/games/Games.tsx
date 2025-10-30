import React, { useState } from "react";
import { Dice5, Coins, Crown, Zap, Trophy, Star } from "lucide-react";
import { DiceGame } from "./games/DiceGame";
import { SlotsGame } from "./games/SlotsGame";
import { BlackjackGame } from "./games/BlackjackGame";
import { RouletteGame } from "./games/RouletteGame";
import { useSelector } from "react-redux";
import { getUserData } from "../../redux/user/selectors";
import { useAppDispatch } from "../../redux/store";
import { putUser } from "../../redux/user/putUser";
import { fetchUserData } from "../../redux/user/apiUser";

export interface GamesProps {
  points: number;
  setPoints: (points: number) => void;
  onBack: () => void;
  onGameResult: (
    result: "win" | "loss",
    pointsChange: number,
    newPoints: number
  ) => void;
  bet: {
    increase: number[];
    min: number;
    max: number;
    fast: number[];
  };
}

export const Games: React.FC = () => {
  const { userData } = useSelector(getUserData);
  const dispatch = useAppDispatch();
  console.log("Rendering Games component with userData:", userData);

  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(userData?.card?.points || 0);

  // Исправленная функция для обновления статистики после игры
  const handleGameResult = (
    result: "win" | "loss",
    pointsChange: number,
    newPoints: number
  ) => {
    if (!userData) return;

    const currentWins = userData.stats?.wins || 0;
    const currentLosses = userData.stats?.losses || 0;
    const currentGamesPlayed = userData.stats?.gamesPlayed || 0;

    const updatedStats = {
      wins: result === "win" ? currentWins + 1 : currentWins,
      losses: result === "loss" ? currentLosses + 1 : currentLosses,
      gamesPlayed: currentGamesPlayed + 1,
    };

    // Отправляем запрос на обновление данных
    dispatch(
      putUser({
        userId: parseInt(userData.id),
        points: newPoints, // Передаем новые очки
        wins: updatedStats.wins,
        losses: updatedStats.losses,
        gamesPlayed: updatedStats.gamesPlayed,
      })
    );

    // Обновляем локальные очки
    setPoints(newPoints);
  };

  const bet = {
    increase: [100, 500],
    min: 10,
    max: 1000,
    fast: [100, 250, 500],
  };

  const games = [
    {
      id: "dice",
      name: "Кости",
      description: "Проверьте свою удачу в костях",
      icon: Dice5,
      color: "from-purple-600 to-pink-600",
      minEntry: bet.min,
      players: "1.2к",
    },
    {
      id: "slots",
      name: "Слоты",
      description: "Соберите выигрышные комбинации",
      icon: Coins,
      color: "from-blue-600 to-cyan-600",
      minEntry: bet.min,
      players: "2.4к",
    },
    {
      id: "blackjack",
      name: "Блэкджек",
      description: "Наберите нужное количество очков",
      icon: Crown,
      color: "from-emerald-600 to-green-600",
      minEntry: bet.min,
      players: "856",
    },
    {
      id: "roulette",
      name: "Рулетка",
      description: "Угадайте выигрышный сектор",
      icon: Zap,
      color: "from-orange-600 to-red-600",
      minEntry: bet.min,
      players: "1.8к",
    },
  ];

  // Рендер активной игры
  if (activeGame === "dice") {
    const onBackPage = () => {
      setActiveGame(null);
      dispatch(fetchUserData());
    };

    return (
      <DiceGame
        points={points}
        setPoints={setPoints}
        onBack={onBackPage}
        onGameResult={handleGameResult}
        bet={bet}
      />
    );
  }

  if (activeGame === "slots") {
    const onBackPage = () => {
      setActiveGame(null);
      dispatch(fetchUserData());
    };
    return (
      <SlotsGame
        points={points}
        setPoints={setPoints}
        onBack={onBackPage}
        onGameResult={handleGameResult}
        bet={bet}
      />
    );
  }

  if (activeGame === "blackjack") {
    const onBackPage = () => {
      setActiveGame(null);
      dispatch(fetchUserData());
    };
    return (
      <BlackjackGame
        points={points}
        setPoints={setPoints}
        onBack={onBackPage}
        onGameResult={handleGameResult}
        bet={bet}
      />
    );
  }

  if (activeGame === "roulette") {
    const onBackPage = () => {
      setActiveGame(null);
      dispatch(fetchUserData());
    };
    return (
      <RouletteGame
        points={points}
        setPoints={setPoints}
        onBack={onBackPage}
        onGameResult={handleGameResult}
        bet={bet}
      />
    );
  }

  // Главное меню игр
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Игровая зона</h1>
          <p className="text-gray-400 text-sm">
            Играйте для развлечения и соревнуйтесь с друзьями
          </p>
        </div>

        {/* Balance */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-400 text-sm">Ваш баланс</div>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />$
                {points.toLocaleString()}
              </div>
            </div>
            <button className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1 text-sm">
              <Star className="w-4 h-4" />
              Ежедневный бонус
            </button>
          </div>
        </div>

        {/* Games List */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <div
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="bg-gray-800 rounded-xl p-3 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${game.color} flex items-center justify-center`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h3 className="text-white font-bold text-base mb-1">
                  {game.name}
                </h3>
                <p className="text-gray-400 text-xs mb-2">{game.description}</p>

                <div className="flex justify-between items-center">
                  <div className="text-gray-500 text-xs">
                    Мин:{" "}
                    <span className="text-white font-semibold">
                      ${game.minEntry}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    {game.players}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning */}
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="text-yellow-400 text-xs text-center">
            ⚠️ Игра предназначена для развлечения. Игровая валюта не имеет
            реальной ценности.
          </div>
        </div>
      </div>
    </div>
  );
};
