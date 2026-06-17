import React from 'react';

interface RouletteItemProps {
  label: string;
  isSelected?: boolean;
  index: number;
  total: number;
  className?: string;
}

export const RouletteItem: React.FC<RouletteItemProps> = ({
  label,
  isSelected = false,
  index,
  total,
  className = '',
}) => {
  const rotation = (360 / total) * index;

  return (
    <div
      className={`roulette-item ${isSelected ? 'selected' : ''} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <span className="roulette-item-label">{label}</span>
    </div>
  );
};
