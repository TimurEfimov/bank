import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { registerUser } from '../../redux/user/register';

interface RegisterProps {
  onBack: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      setIsLoading(false);
      return;
    }

    try {
      // @ts-ignore - временно игнорируем типы
      await dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })).unwrap();
      // После успешной регистрации ProtectedRoute автоматически перенаправит
    } catch (error) {
      setError('Ошибка регистрации. Возможно, пользователь уже существует');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>

        <h1 className="text-3xl font-bold text-white text-center mb-2">Регистрация</h1>
        <p className="text-purple-200 text-center mb-6">Создайте новый аккаунт</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Имя пользователя"
              className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Пароль"
              className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-colors"
              required
              minLength={6}
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Подтвердите пароль"
              className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-colors"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-center text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-6 text-center text-purple-300 text-sm">
          Уже есть аккаунт?{' '}
          <button
            onClick={() => onBack()}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Войдите
          </button>
        </div>
      </div>
    </div>
  );
};