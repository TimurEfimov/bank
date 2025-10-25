import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';

export const AuthSelection: React.FC = () => {
  const [currentView, setCurrentView] = useState<'selection' | 'login' | 'register'>('selection');

  if (currentView === 'login') {
    return <Login onBack={() => setCurrentView('selection')} />;
  }

  if (currentView === 'register') {
    return <Register onBack={() => setCurrentView('selection')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Добро пожаловать!</h1>
        <p className="text-purple-200 text-center mb-8">Выберите действие</p>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentView('login')}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Войти
          </button>

          <button
            onClick={() => setCurrentView('register')}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-purple-400/30 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Зарегистрироваться
          </button>
        </div>

        <div className="mt-6 text-center text-purple-300 text-sm">
          Тестовый аккаунт: andrey@example.com / 123456
        </div>
      </div>
    </div>
  );
};