import React, { useState } from "react";
import { Dice5, Coins, Crown, Zap } from "lucide-react";
import { DiceGame } from "./games/DiceGame";
import { SlotsGame } from "./games/SlotsGame";
import { BlackjackGame } from "./games/BlackjackGame";
import { RouletteGame } from "./games/RouletteGame";
import { useSelector } from "react-redux";
import { getUserData } from "../../redux/user/selectors";
import { useAppDispatch } from "../../redux/store";
import { putUser } from "../../redux/user/putUser";
import { fetchUserData } from "../../redux/user/apiUser";

export const Games: React.FC = () => {
  const { userData } = useSelector(getUserData);
  const dispatch = useAppDispatch();

  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(userData?.card?.balance || 0);

  // Функция для обновления статистики после игры
  const updateUserStats = (
    result: "win" | "loss",
    amount: number,
    newBalance: number
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
        balance: newBalance,
        wins: updatedStats.wins,
        losses: updatedStats.losses,
        gamesPlayed: updatedStats.gamesPlayed,
      })
    );

    // Обновляем локальный баланс
    setBalance(newBalance);
  };

  const games = [
    {
      id: "dice",
      name: "Кости",
      description: "Классическая игра в кости",
      icon: Dice5,
      color: "from-purple-600 to-pink-600",
      minBet: 100,
      players: "1.2k",
    },
    {
      id: "slots",
      name: "Слоты",
      description: "Вращай барабаны и выигрывай",
      icon: Coins,
      color: "from-blue-600 to-cyan-600",
      minBet: 100,
      players: "2.4k",
    },
    {
      id: "blackjack",
      name: "Блэкджек",
      description: "Набери 21 очко",
      icon: Crown,
      color: "from-emerald-600 to-green-600",
      minBet: 100,
      players: "856",
    },
    {
      id: "roulette",
      name: "Рулетка",
      description: "Сделай свою ставку",
      icon: Zap,
      color: "from-orange-600 to-red-600",
      minBet: 100,
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
        balance={balance}
        setBalance={setBalance}
        onBack={onBackPage}
        onGameResult={updateUserStats}
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
        balance={balance}
        setBalance={setBalance}
        onBack={onBackPage}
        onGameResult={updateUserStats}
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
        balance={balance}
        setBalance={setBalance}
        onBack={onBackPage}
        onGameResult={updateUserStats}
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
        balance={balance}
        setBalance={setBalance}
        onBack={onBackPage}
        onGameResult={updateUserStats}
      />
    );
  }

  // Главное меню игр
  return (
    <div className="mx-4 my-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Игры</h1>
        <p className="text-purple-300/70">Выберите игру и начните выигрывать</p>
      </div>

      {/* Баланс */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-white/60 text-sm">Ваш баланс</div>
            <div className="text-2xl font-bold text-white">
              {balance.toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300">
            Пополнить
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
                  Мин. ставка:{" "}
                  <span className="text-white font-semibold">
                    {game.minBet} ₽
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
    </div>
  );
};
