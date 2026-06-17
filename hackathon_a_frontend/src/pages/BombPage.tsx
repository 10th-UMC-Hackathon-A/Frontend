import { useState } from 'react';
import { BombCard } from '../components/bomb/BombCard';

export default function BombPage() {
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  const handleCardClick = (index: number) => {
    setRevealedCards([...revealedCards, index]);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">폭탄 찾기</h1>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 9 }, (_, i) => (
          <BombCard
            key={i}
            index={i}
            isRevealed={revealedCards.includes(i)}
            onClick={() => handleCardClick(i)}
          />
        ))}
      </div>
    </div>
  );
}
