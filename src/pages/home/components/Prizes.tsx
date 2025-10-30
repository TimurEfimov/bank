import React from "react";
import { Upload, Home, Camera } from "lucide-react";

export const Prizes: React.FC = () => {

  const steps = [
    {
      id: 1,
      title: "Сними креативное видео",
      description: "Прояви фантазию и создай уникальное видео с Mellstroy.game",
      icon: Camera,
      color: "from-purple-600 to-pink-600",
      details: "Тема: на ваше усмотрение\nГлавное - креативность!",
      short: "Сними видео",
    },
    {
      id: 2,
      title: "Выложи в TikTok",
      description: "Опубликуй видео с хештегом #MellstroyGame",
      icon: Upload,
      color: "from-blue-600 to-cyan-600",
      details: "Обязательные хештеги:\n#Mellstroy.game",
      short: "Запости в TikTok",
    },
    {
      id: 3,
      title: "Получи квартиру",
      description: "Лучшие работы получат ключи от новой квартиры!",
      icon: Home,
      color: "from-emerald-600 to-green-600",
      details:
        "Главный приз: квартира\nДополнительные призы: $10,000\nСрок: до 17 ноября",
      short: "Получи приз",
    },
  ];

  return (
    <>
      {/* Три кружочка с условиями */}
      <div className="bg-gray-800 rounded-xl mx-4 my-6 p-4 border border-gray-700">
        <div
          className="flex justify-between items-center cursor-pointer"
        >
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                {/* Кружок с иконкой */}
                <div
                  className={`
                  w-12 h-12 rounded-full bg-gradient-to-r ${step.color} 
                  flex items-center justify-center text-white
                  border border-white/20
                `}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Подпись */}
                <span className="text-xs text-center text-white font-medium">
                  {step.short}
                </span>

                {/* Соединительная линия (кроме последнего) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block w-8 h-0.5 bg-gray-600 mt-1" />
                )}
              </div>
            );
          })}
        </div>

        {/* Текст призыва */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Участвуй в конкурсе и выиграй квартиру!
          </p>
        </div>
      </div>
    </>
  );
};