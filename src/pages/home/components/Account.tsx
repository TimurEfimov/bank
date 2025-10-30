import React from "react";
import {
  Plus,
  Eye,
  EyeOff,
  Calendar,
  QrCode,
  Copy,
  Check,
  Trophy,
  Star,
} from "lucide-react";

interface Props {
  fullName: string | undefined;
  card:
    | {
        points: number;
        number: string;
        code: string;
        date: string;
      }
    | undefined;
}

export const Account: React.FC<Props> = ({ fullName, card }) => {
  const [isPointsVisible, setIsPointsVisible] = React.useState(true);
  const [isCardDetailsVisible, setIsCardDetailsVisible] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const formatPoints = (amount: number) => {
    return new Intl.NumberFormat("ru-RU").format(amount);
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatCardNumberHidden = (number: string) => {
    const visiblePart = number.slice(-4);
    return `•••• •••• •••• ${visiblePart}`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Используем реальные данные из props или fallback значения
  const cardData = {
    number: card?.number || "2200123456789012",
    expiry: card?.date || "12/28",
    code: card?.code || "123",
    points: card?.points || 15470,
    holder: fullName ? `${fullName.toUpperCase()}` : "АНДРЕЙ Б.",
    system: "VISA",
  };

  return (
    <div className="bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Игровая карта */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-gray-400 text-sm font-medium mb-1">
                Игровой баланс
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">
                  {isPointsVisible
                    ? `$${formatPoints(cardData.points)}`
                    : "•••••"}
                </span>
                <button
                  onClick={() => setIsPointsVisible(!isPointsVisible)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  {isPointsVisible ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="text-right flex flex-col items-center gap-1">
              <Trophy className="w-6 h-6 text-yellow-400 mb-1" />
              <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                GAME CARD
              </div>
            </div>
          </div>

          {/* Номер карты */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 flex-wrap">
              {isCardDetailsVisible
                ? formatCardNumber(cardData.number)
                    .split(" ")
                    .map((part, index) => (
                      <span
                        key={index}
                        className="text-sm font-mono font-bold text-white"
                      >
                        {part}
                      </span>
                    ))
                : formatCardNumberHidden(cardData.number)
                    .split(" ")
                    .map((part, index) => (
                      <span
                        key={index}
                        className="text-sm font-mono font-bold text-white"
                      >
                        {part}
                      </span>
                    ))}
            </div>
            <button
              onClick={() => setIsCardDetailsVisible(!isCardDetailsVisible)}
              className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0 ml-2"
            >
              {isCardDetailsVisible ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Детали карты */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Срок действия</div>
                <div className="text-white text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  {cardData.expiry}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Игрок</div>
                <div className="text-white text-sm">{cardData.holder}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-xs mb-1">Валюта</div>
              <div className="text-white text-sm flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />$
              </div>
            </div>
          </div>

          {/* Детали карты (скрытые по умолчанию) */}
          {isCardDetailsVisible && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <h4 className="text-gray-400 text-sm font-medium mb-3">
                Данные игровой карты
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-gray-400 text-xs mb-1">Номер карты</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-mono text-sm">
                      {formatCardNumber(cardData.number)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(cardData.number, "number")}
                      className="p-1 hover:bg-gray-700 rounded transition-colors ml-2"
                    >
                      {copiedField === "number" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">CVV/CVC код</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-mono text-sm">
                      {cardData.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(cardData.code, "code")}
                      className="p-1 hover:bg-gray-700 rounded transition-colors ml-2"
                    >
                      {copiedField === "code" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">
                    Срок действия
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-mono text-sm">
                      {cardData.expiry}
                    </span>
                    <button
                      onClick={() => copyToClipboard(cardData.expiry, "expiry")}
                      className="p-1 hover:bg-gray-700 rounded transition-colors ml-2"
                    >
                      {copiedField === "expiry" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Игрок</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-mono text-sm">
                      {cardData.holder}
                    </span>
                    <button
                      onClick={() => copyToClipboard(cardData.holder, "holder")}
                      className="p-1 hover:bg-gray-700 rounded transition-colors ml-2"
                    >
                      {copiedField === "holder" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-3 rounded-lg transition-colors flex flex-col items-center justify-center gap-1">
            <Plus className="w-5 h-5" />
            <span className="font-semibold text-xs text-center">
              Пополнить
            </span>
          </button>

          <button className="bg-green-600 hover:bg-green-500 text-white py-3 px-3 rounded-lg transition-colors flex flex-col items-center justify-center gap-1">
            <QrCode className="w-5 h-5" />
            <span className="font-semibold text-xs text-center">
              Мой QR-код
            </span>
          </button>
        </div>

        {/* Предупреждение */}
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="text-yellow-400 text-xs text-center">
            ⚠️ Игровая валюта. Не имеет денежной стоимости.
          </div>
        </div>
      </div>
    </div>
  );
};
