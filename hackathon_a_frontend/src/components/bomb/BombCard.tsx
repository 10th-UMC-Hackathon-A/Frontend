import React from 'react';

interface BombCardProps {
  index: number;
  isRevealed?: boolean;
  isBomb?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const BombCard: React.FC<BombCardProps> = ({
  index,
  isRevealed = false,
  isBomb = false,
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <div
      className={`bomb-card ${isRevealed ? 'revealed' : ''} ${isBomb ? 'bomb' : 'safe'} ${className}`}
      onClick={!disabled ? onClick : undefined}
    >
      {isRevealed ? (
        <div className="bomb-card-content">
          {isBomb ? '💣' : '✓'}
        </div>
      ) : (
        <div className="bomb-card-back">{index + 1}</div>
      )}
    </div>
  );
};
