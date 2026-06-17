import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { RouletteWheel } from '../components/roulette/RouletteWheel';
import { Button } from '../components/common/Button';

export const RoulettePage: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const handleSpin = () => {
    setIsSpinning(true);
    // TODO: Implement roulette spin logic
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedIndex(Math.floor(Math.random() * 4));
    }, 3000);
  };

  return (
    <Layout>
      <div className="roulette-page">
        <h1>룰렛</h1>
        <RouletteWheel
          items={['참가자 1', '참가자 2', '참가자 3', '참가자 4']}
          selectedIndex={selectedIndex}
          isSpinning={isSpinning}
        />
        <Button onClick={handleSpin} disabled={isSpinning}>
          돌리기
        </Button>
      </div>
    </Layout>
  );
};
