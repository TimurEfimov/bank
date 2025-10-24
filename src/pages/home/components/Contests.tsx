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
    subtitle: "Призовой фонд 1.000.000₽",
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
    <div className="relative h-28 overflow-hidden bg-purple-950/80 rounded-2xl mx-4 mt-4 shadow-xl border border-emerald-500/20 backdrop-blur-sm">
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 to-emerald-900/70" />
            </div>

            {/* Контент */}
            <div className="relative z-10 h-full flex flex-col justify-center p-5">
              <h3 className="text-xl game mb-1 text-white">{contest.title}</h3>
              <p className="text-emerald-300 text-sm font-medium tracking-wide">
                {contest.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Индикаторы слайдов */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {mockContests.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-emerald-400 scale-125"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
