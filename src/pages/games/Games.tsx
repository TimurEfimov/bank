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

  // Функция для обновления статистики после игры
  const updateUserStats = (result: "win" | "loss", newPoints: number) => {
    if (!userData) return;

    const currentWins = userData.stats?.wins || 0;
    const currentLosses = userData.stats?.losses || 0;
    const currentGamesPlayed = userData.stats?.gamesPlayed || 0;

    const updatedStats = {
      wins: result === "win" ? currentWins + 1 : currentWins,
      losses: result === "loss" ? currentLosses + 1 : currentLosses,
      gamesPlayed: currentGamesPlayed + 1,
      points: newPoints,
    };

    // Отправляем запрос на обновление данных
    dispatch(
      putUser({
        userId: parseInt(userData.id),
        wins: updatedStats.wins,
        losses: updatedStats.losses,
        gamesPlayed: updatedStats.gamesPlayed,
        points: updatedStats.points,
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
      description: "Проверь свою удачу в костях",
      icon: Dice5,
      color: "from-purple-600 to-pink-600",
      minEntry: bet.min,
      players: "1.2k",
    },
    {
      id: "slots",
      name: "Слоты",
      description: "Собери выигрышные комбинации",
      icon: Coins,
      color: "from-blue-600 to-cyan-600",
      minEntry: bet.min,
      players: "2.4k",
    },
    {
      id: "blackjack",
      name: "21 очко",
      description: "Набери нужное количество очков",
      icon: Crown,
      color: "from-emerald-600 to-green-600",
      minEntry: bet.min,
      players: "856",
    },
    {
      id: "roulette",
      name: "Рулетка",
      description: "Угадай выигрышный сектор",
      icon: Zap,
      color: "from-orange-600 to-red-600",
      minEntry: bet.min,
      players: "1.8k",
    },
  ];

  // Рендер активной игры с передачей функции обновления статистики
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
        onGameResult={updateUserStats}
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
        onGameResult={updateUserStats}
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
        onGameResult={updateUserStats}
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
        onGameResult={updateUserStats}
        bet={bet}
      />
    );
  }

  // Главное меню игр
  return (
    <div className="mx-4 my-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Игровая зона</h1>
        <p className="text-purple-300/70">
          Играйте для развлечения и соревнуйтесь с друзьями
        </p>
      </div>

      {/* Игровые очки */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-white/60 text-sm">Ваши игровые очки</div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              {points.toLocaleString("ru-RU")} очков
            </div>
            <div className="text-white/40 text-xs mt-1">
              Накопите очки для улучшения рейтинга
            </div>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Ежедневный бонус
          </button>
        </div>
      </div>

      {/* Список игр */}
      <div className="grid grid-cols-2 gap-4">
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <div
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:scale-100 cursor-pointer group backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${game.color} flex items-center justify-center shadow-lg`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>

              <h3 className="text-white font-bold text-lg mb-1">{game.name}</h3>
              <p className="text-purple-300/70 text-sm mb-3">
                {game.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="text-white/50 text-xs">
                  Вход:{" "}
                  <span className="text-white font-semibold">
                    {game.minEntry} очков
                  </span>
                </div>
                <div className="flex items-center gap-1 text-white/50 text-xs">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  {game.players}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Важное предупреждение */}
      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <div className="text-yellow-400 text-sm text-center">
          ⚠️ Все игры предназначены исключительно для развлечения. Игровые очки
          не имеют денежной стоимости и не могут быть обменены на реальные
          ценности.
        </div>
      </div>
    </div>
  );
};
