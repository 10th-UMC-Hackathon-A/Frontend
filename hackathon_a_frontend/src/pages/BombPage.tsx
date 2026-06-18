import { useState } from "react";
import { BombCard } from "../components/bomb/BombCard";
import { Button } from "../components/common/Button";

const CARD_COUNT = 6;
const currentPlayer = "더워요2 (닉네임)";

export default function BombPage() {
  const [bombIndex] = useState(() => Math.floor(Math.random() * CARD_COUNT));
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  const isFinished = revealedCards.includes(bombIndex);

  const reveal = (index: number) => {
    setRevealedCards((prev) =>
      prev.includes(index) ? prev : [...prev, index],
    );
  };

  const handleCardClick = (index: number) => {
    if (isFinished) return;
    reveal(index);
  };

  const handleDraw = () => {
    if (isFinished) return;
    const remaining = Array.from({ length: CARD_COUNT }, (_, i) => i).filter(
      (i) => !revealedCards.includes(i),
    );
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    reveal(pick);
  };

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">제비뽑기</h1>
          <p className="text-sm text-gray-400">
            제비를 하나 뽑아 벌칙자를 정해요
          </p>
        </div>

        <div className="flex flex-col gap-1 items-center bg-gray-100 rounded-2xl py-4">
          <p className="text-xs text-gray-400">지금 차례</p>
          <p className="text-base font-semibold text-gray-900">
            {currentPlayer}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: CARD_COUNT }, (_, i) => (
            <BombCard
              key={i}
              index={i}
              isRevealed={revealedCards.includes(i)}
              isBomb={i === bombIndex}
              disabled={isFinished && !revealedCards.includes(i)}
              onClick={() => handleCardClick(i)}
            />
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center">
          당첨 제비를 뽑은 사람이 벌칙자!
        </p>
      </div>

      <Button onClick={handleDraw} disabled={isFinished} fullWidth>
        제비 뽑기
      </Button>
    </div>
  );
}
