import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface DiceGameProps {
  balance: number;
  setBalance: (balance: number) => void;
  onBack: () => void;
}

export const DiceGame: React.FC<DiceGameProps> = ({ balance, setBalance, onBack }) => {
  const [bet, setBet] = useState(100);
  const [playerDice, setPlayerDice] = useState(1);
  const [computerDice, setComputerDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const rollDice = () => {
    if (isRolling || bet > balance) return;
    
    setIsRolling(true);
    setResult(null);
    const newBalance = balance - bet;
    setBalance(newBalance);

    let rolls = 0;
    const rollInterval = setInterval(() => {
      setPlayerDice(Math.floor(Math.random() * 6) + 1);
      setComputerDice(Math.floor(Math.random() * 6) + 1);
      rolls++;
      
      if (rolls > 10) {
        clearInterval(rollInterval);
        const finalPlayer = Math.floor(Math.random() * 6) + 1;
        const finalComputer = Math.floor(Math.random() * 6) + 1;
        
        setPlayerDice(finalPlayer);
        setComputerDice(finalComputer);
        setIsRolling(false);

        let gameResult: 'win' | 'lose' | 'draw';
        let winAmount = 0;

        if (finalPlayer > finalComputer) {
          gameResult = 'win';
          winAmount = bet * 2;
          setBalance(newBalance + winAmount);
          setHistory(prev => [`Выигрыш +${winAmount}₽ (${finalPlayer} vs ${finalComputer})`, ...prev.slice(0, 4)]);
        } else if (finalPlayer < finalComputer) {
          gameResult = 'lose';
          setHistory(prev => [`Проигрыш -${bet}₽ (${finalPlayer} vs ${finalComputer})`, ...prev.slice(0, 4)]);
        } else {
          gameResult = 'draw';
          setBalance(newBalance + bet);
          setHistory(prev => [`Ничья (${finalPlayer} vs ${finalComputer})`, ...prev.slice(0, 4)]);
        }
        
        setResult(gameResult);
      }
    }, 100);
  };

  return (
    <div className="mx-4 my-6">
      <button onClick={onBack} className="flex items-center gap-2 text-purple-300/70 mb-4 hover:text-white transition-colors">
        <RotateCcw className="w-4 h-4" />
        Назад к играм
      </button>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Игра в Кости</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/20 rounded-xl p-3 text-center">
            <div className="text-white/60 text-sm">Баланс</div>
            <div className="text-xl font-bold text-white">{balance.toLocaleString('ru-RU')} ₽</div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 text-center">
            <div className="text-white/60 text-sm">Ставка</div>
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="text-xl font-bold text-white bg-transparent border-none outline-none text-center w-full"
              min="10"
              max={balance}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <div className="text-white/60 mb-2">Вы</div>
            <div className={`text-6xl transition-transform duration-300 ${isRolling ? 'animate-bounce' : ''}`}>
              {['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][playerDice - 1]}
            </div>
            <div className="text-white/60 mt-2">{playerDice}</div>
          </div>

          <div className="text-2xl text-white/40">VS</div>

          <div className="text-center">
            <div className="text-white/60 mb-2">Компьютер</div>
            <div className={`text-6xl transition-transform duration-300 ${isRolling ? 'animate-bounce' : ''}`}>
              {['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][computerDice - 1]}
            </div>
            <div className="text-white/60 mt-2">{computerDice}</div>
          </div>
        </div>

        {result && (
          <div className={`text-center text-2xl font-bold mb-4 ${
            result === 'win' ? 'text-emerald-400' : 
            result === 'lose' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {result === 'win' ? 'ПОБЕДА! 🎉' : result === 'lose' ? 'ПРОИГРЫШ 😔' : 'НИЧЬЯ 🤝'}
          </div>
        )}

        <button
          onClick={rollDice}
          disabled={isRolling || bet > balance}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isRolling ? 'Бросок...' : `Бросить кости (${bet}₽)`}
        </button>

        <div className="mt-6">
          <h3 className="text-white font-semibold mb-3">История игр</h3>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div key={index} className="text-white/60 text-sm bg-white/5 rounded-lg p-2">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};