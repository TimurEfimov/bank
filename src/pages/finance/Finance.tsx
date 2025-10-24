import React, { useState } from 'react';
import { TrendingUp, PieChart, Target, Calendar, Plus, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export const Finance: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const stats = {
    balance: 15470.85,
    income: 25300,
    expenses: 9830,
    profit: 15470
  };

  const investments = [
    {
      id: 1,
      name: "Акции Tesla",
      symbol: "TSLA",
      amount: 50000,
      change: +12.5,
      value: 56250,
      type: "stocks"
    },
    {
      id: 2,
      name: "Крипто портфель",
      symbol: "CRYPTO",
      amount: 30000,
      change: -3.2,
      value: 29040,
      type: "crypto"
    },
    {
      id: 3,
      name: "Облигации",
      symbol: "BONDS",
      amount: 100000,
      change: +2.1,
      value: 102100,
      type: "bonds"
    },
    {
      id: 4,
      name: "Фонд недвижимости",
      symbol: "REIT",
      amount: 75000,
      change: +5.7,
      value: 79275,
      type: "estate"
    }
  ];

  const transactions = [
    {
      id: 1,
      type: 'investment',
      name: 'Покупка TSLA',
      amount: -5000,
      date: '15.10.2024',
      status: 'completed'
    },
    {
      id: 2,
      type: 'dividend',
      name: 'Дивиденды Apple',
      amount: 1250,
      date: '14.10.2024',
      status: 'completed'
    },
    {
      id: 3,
      type: 'withdrawal',
      name: 'Вывод средств',
      amount: -3000,
      date: '13.10.2024',
      status: 'completed'
    },
    {
      id: 4,
      type: 'interest',
      name: 'Проценты по вкладу',
      amount: 870,
      date: '12.10.2024',
      status: 'completed'
    }
  ];

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.value, 0);
  const totalChange = investments.reduce((sum, inv) => sum + (inv.value - inv.amount), 0);

  return (
    <div className="mx-4 my-6">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Финансы</h1>
        <p className="text-purple-300/70">Управление инвестициями и капиталом</p>
      </div>

      {/* Основная статистика */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
          <div className="text-white/60 text-sm mb-1">Общий капитал</div>
          <div className="text-2xl font-bold text-white">{stats.balance.toLocaleString('ru-RU')} ₽</div>
          <div className="text-emerald-400 text-sm flex items-center gap-1 mt-1">
            <TrendingUp className="w-4 h-4" />
            +15.3%
          </div>
        </div>
        
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
          <div className="text-white/60 text-sm mb-1">Инвестиции</div>
          <div className="text-2xl font-bold text-white">{totalInvestment.toLocaleString('ru-RU')} ₽</div>
          <div className={`text-sm flex items-center gap-1 mt-1 ${totalChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {totalChange >= 0 ? '+' : ''}{((totalChange / totalInvestment) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Период */}
      <div className="flex gap-2 mb-6">
        {['week', 'month', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range as any)}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              timeRange === range
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {range === 'week' ? 'Неделя' : range === 'month' ? 'Месяц' : 'Год'}
          </button>
        ))}
      </div>

      {/* Инвестиционные инструменты */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Инвестиции</h2>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>

        <div className="space-y-3">
          {investments.map((investment) => (
            <div key={investment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  investment.type === 'stocks' ? 'bg-blue-500/20 text-blue-400' :
                  investment.type === 'crypto' ? 'bg-orange-500/20 text-orange-400' :
                  investment.type === 'bonds' ? 'bg-green-500/20 text-green-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-semibold">{investment.name}</div>
                  <div className="text-white/50 text-sm">{investment.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{investment.value.toLocaleString('ru-RU')} ₽</div>
                <div className={`text-sm flex items-center justify-end gap-1 ${
                  investment.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {investment.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {investment.change >= 0 ? '+' : ''}{investment.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Финансовая аналитика */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center backdrop-blur-sm">
          <PieChart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-white/60 text-sm">Доходы</div>
          <div className="text-emerald-400 text-lg font-bold">{stats.income.toLocaleString('ru-RU')} ₽</div>
        </div>
        
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center backdrop-blur-sm">
          <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-white/60 text-sm">Расходы</div>
          <div className="text-red-400 text-lg font-bold">{stats.expenses.toLocaleString('ru-RU')} ₽</div>
        </div>
      </div>

      {/* Последние транзакции */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-4">Последние операции</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  transaction.amount > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {transaction.amount > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-white font-semibold">{transaction.name}</div>
                  <div className="text-white/50 text-sm">{transaction.date}</div>
                </div>
              </div>
              <div className={`text-lg font-bold ${
                transaction.amount > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2">
          <Wallet className="w-5 h-5" />
          Перевод
        </button>
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Инвестировать
        </button>
      </div>
    </div>
  );
};