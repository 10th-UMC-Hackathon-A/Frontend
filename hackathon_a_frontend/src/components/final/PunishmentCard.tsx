import React from 'react';

interface PunishmentCardProps {
  nickname: string;
  punishment: string;
  className?: string;
}

export const PunishmentCard: React.FC<PunishmentCardProps> = ({
  nickname,
  punishment,
  className = '',
}) => {
  return (
    <div className={`punishment-card ${className}`}>
      <h2 className="punishment-card-title">벌칙 대상</h2>
      <div className="punishment-card-content">
        <div className="punishment-nickname">{nickname}</div>
        <div className="punishment-divider" />
        <div className="punishment-description">{punishment}</div>
      </div>
    </div>
  );
};
