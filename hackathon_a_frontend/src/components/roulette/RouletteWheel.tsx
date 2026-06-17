import React from 'react';
import { RouletteItem } from './RouletteItem';

interface RouletteWheelProps {
  items: string[];
  selectedIndex?: number;
  isSpinning?: boolean;
  className?: string;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  items,
  selectedIndex,
  isSpinning = false,
  className = '',
}) => {
  return (
    <div className={`roulette-wheel ${isSpinning ? 'spinning' : ''} ${className}`}>
      <div className="roulette-items">
        {items.map((item, index) => (
          <RouletteItem
            key={index}
            label={item}
            isSelected={selectedIndex === index}
            index={index}
            total={items.length}
          />
        ))}
      </div>
    </div>
  );
};
