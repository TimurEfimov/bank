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
    <div className="mx-4 my-4 space-y-4">
      {/* Игровая карта */}
      <div className="bg-gradient-to-br from-purple-950/90 via-purple-900/80 to-purple-800/70 rounded-2xl p-5 shadow-xl border border-emerald-500/30 relative overflow-hidden backdrop-blur-sm">
        {/* Декоративные элементы карты */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-emerald-400/5 rounded-full -translate-x-8 translate-y-10"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex-1">
            <h3 className="text-white/70 text-xs font-medium mb-1">
              Игровой баланс
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">
                {isPointsVisible
                  ? `${formatPoints(cardData.points)} MP`
                  : "••••• MP"}
              </span>
              <button
                onClick={() => setIsPointsVisible(!isPointsVisible)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
              >
                {isPointsVisible ? (
                  <EyeOff className="w-4 h-4 text-white/50" />
                ) : (
                  <Eye className="w-4 h-4 text-white/50" />
                )}
              </button>
            </div>
          </div>
          <div className="text-right">
            <Trophy className="w-8 h-8 text-yellow-400 mb-1" />
            <div className="text-[10px] text-white/50 bg-white/5 px-2 py-1 rounded-full border border-white/10">
              GAME CARD
            </div>
          </div>
        </div>

        {/* Номер карты */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex gap-1 flex-wrap">
            {isCardDetailsVisible
              ? formatCardNumber(cardData.number)
                  .split(" ")
                  .map((part, index) => (
                    <span
                      key={index}
                      className="text-base font-mono font-bold text-white/80"
                    >
                      {part}
                    </span>
                  ))
              : formatCardNumberHidden(cardData.number)
                  .split(" ")
                  .map((part, index) => (
                    <span
                      key={index}
                      className="text-base font-mono font-bold text-white/80"
                    >
                      {part}
                    </span>
                  ))}
          </div>
          <button
            onClick={() => setIsCardDetailsVisible(!isCardDetailsVisible)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 flex-shrink-0 ml-2"
          >
            {isCardDetailsVisible ? (
              <EyeOff className="w-4 h-4 text-white/50" />
            ) : (
              <Eye className="w-4 h-4 text-white/50" />
            )}
          </button>
        </div>

        {/* Детали карты */}
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-white/50 text-[10px] mb-1">
                Срок действия
              </div>
              <div className="text-white text-sm font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-white/60" />
                {cardData.expiry}
              </div>
            </div>
            <div>
              <div className="text-white/50 text-[10px] mb-1">Игрок</div>
              <div className="text-white text-sm font-medium">
                {cardData.holder}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/50 text-[10px] mb-1">Валюта</div>
            <div className="text-white text-sm font-medium flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              MP
            </div>
          </div>
        </div>

        {/* Детали карты (скрытые по умолчанию) */}
        {isCardDetailsVisible && (
          <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
            <h4 className="text-white/70 text-sm font-medium mb-3">
              Данные игровой карты
            </h4>
            <div className="space-y-3">
              <div>
                <div className="text-white/50 text-xs mb-1">Номер карты</div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono text-sm">
                    {formatCardNumber(cardData.number)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(cardData.number, "number")}
                    className="p-1 hover:bg-white/10 rounded transition-colors ml-2"
                  >
                    {copiedField === "number" ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/50" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <div className="text-white/50 text-xs mb-1">CVV/CVC код</div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono text-sm">
                    {cardData.code}
                  </span>
                  <button
                    onClick={() => copyToClipboard(cardData.code, "code")}
                    className="p-1 hover:bg-white/10 rounded transition-colors ml-2"
                  >
                    {copiedField === "code" ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/50" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <div className="text-white/50 text-xs mb-1">Срок действия</div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono text-sm">
                    {cardData.expiry}
                  </span>
                  <button
                    onClick={() => copyToClipboard(cardData.expiry, "expiry")}
                    className="p-1 hover:bg-white/10 rounded transition-colors ml-2"
                  >
                    {copiedField === "expiry" ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/50" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <div className="text-white/50 text-xs mb-1">Игрок</div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono text-sm">
                    {cardData.holder}
                  </span>
                  <button
                    onClick={() => copyToClipboard(cardData.holder, "holder")}
                    className="p-1 hover:bg-white/10 rounded transition-colors ml-2"
                  >
                    {copiedField === "holder" ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/50" />
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
        <button className="bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white py-3 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex flex-col items-center justify-center gap-1 group border border-blue-500/20">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span className="font-semibold text-xs text-center">
            Пополнить MP
          </span>
        </button>

        <button className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white py-3 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex flex-col items-center justify-center gap-1 group border border-green-500/20">
          <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-xs text-center">Мой QR-код</span>
        </button>
      </div>

      {/* Предупреждение */}
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <div className="text-yellow-400 text-xs text-center leading-relaxed">
          ⚠️ Mellstroy Points (MP) - игровая валюта. Не имеет денежной
          стоимости.
        </div>
      </div>
    </div>
  );
};
