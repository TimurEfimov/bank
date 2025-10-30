import React, { useState, useEffect } from "react";

interface ContestSlide {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const mockContests: ContestSlide[] = [
  {
    id: 1,
    title: "Mellstroy.game",
    subtitle: "Призовой фонд $10,000",
    backgroundImage: "/contests/contest1.jpg",
  },
  {
    id: 2,
    title: "Mellstroy.game",
    subtitle: "Получи квартиру!",
    backgroundImage: "/contests/contest2.jpg",
  },
  {
    id: 3,
    title: "Mellstroy.game",
    subtitle: "Специальные награды",
    backgroundImage: "/contests/contest3.jpg",
  },
];

export const Contests: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockContests.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 overflow-hidden bg-gray-800 rounded-xl mx-4 mt-4 border border-gray-700">
      {/* Карусель с переключением */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {mockContests.map((contest) => (
          <div
            key={contest.id}
            className="flex-shrink-0 w-full relative rounded-xl overflow-hidden"
          >
            {/* Фоновое изображение */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${contest.backgroundImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80" />
            </div>

            {/* Контент */}
            <div className="relative z-10 h-full flex flex-col justify-center p-4">
              <h3 className="text-lg font-bold mb-1 text-white game">
                {contest.title}
              </h3>
              <p className="text-green-400 text-sm font-medium">
                {contest.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Индикаторы слайдов */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
        {mockContests.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-green-500"
                : "bg-gray-500 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
