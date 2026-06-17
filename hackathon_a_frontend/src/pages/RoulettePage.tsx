import { useState } from 'react';
import { RouletteWheel } from '../components/roulette/RouletteWheel';
import { Button } from '../components/common/Button';

export default function RoulettePage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const handleSpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedIndex(Math.floor(Math.random() * 4));
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">룰렛</h1>
      <RouletteWheel
        items={['참가자 1', '참가자 2', '참가자 3', '참가자 4']}
        selectedIndex={selectedIndex}
        isSpinning={isSpinning}
      />
      <Button onClick={handleSpin} disabled={isSpinning} fullWidth>
        돌리기
      </Button>
    </div>
  );
}
