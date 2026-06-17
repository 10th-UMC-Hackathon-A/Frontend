import React from 'react';

interface VoteResultBarProps {
  nickname: string;
  voteCount: number;
  totalVotes: number;
  isHighest?: boolean;
  className?: string;
}

export const VoteResultBar: React.FC<VoteResultBarProps> = ({
  nickname,
  voteCount,
  totalVotes,
  isHighest = false,
  className = '',
}) => {
  const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

  return (
    <div className={`vote-result-bar ${isHighest ? 'highest' : ''} ${className}`}>
      <div className="vote-result-info">
        <span className="vote-result-nickname">{nickname}</span>
        <span className="vote-result-count">{voteCount}</span>
      </div>
      <div className="vote-result-progress">
        <div
          className="vote-result-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
