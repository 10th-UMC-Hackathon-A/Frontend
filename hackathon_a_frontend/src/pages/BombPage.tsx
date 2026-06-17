import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { BombCard } from '../components/bomb/BombCard';

export const BombPage: React.FC = () => {
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  const handleCardClick = (index: number) => {
    // TODO: Implement bomb card logic
    setRevealedCards([...revealedCards, index]);
  };

  return (
    <Layout>
      <div className="bomb-page">
        <h1>폭탄 찾기</h1>
        <div className="bomb-cards">
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
    </Layout>
  );
};
