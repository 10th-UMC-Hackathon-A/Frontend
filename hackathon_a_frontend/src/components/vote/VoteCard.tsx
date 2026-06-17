import React from 'react';

interface VoteCardProps {
  userId: string;
  nickname: string;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export const VoteCard: React.FC<VoteCardProps> = ({
  userId,
  nickname,
  isSelected = false,
  onSelect,
  className = '',
}) => {
  return (
    <div
      className={`vote-card ${isSelected ? 'selected' : ''} ${className}`}
      onClick={onSelect}
    >
      <div className="vote-card-content">
        <span className="vote-card-nickname">{nickname}</span>
      </div>
    </div>
  );
};
