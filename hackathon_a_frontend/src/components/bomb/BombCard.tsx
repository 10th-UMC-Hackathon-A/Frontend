import React from "react";

interface BombCardProps {
  index: number;
  isRevealed?: boolean;
  isBomb?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const BombCard: React.FC<BombCardProps> = ({
  isRevealed = false,
  isBomb = false,
  onClick,
  disabled = false,
  className = "",
}) => {
  const stateClasses = isRevealed
    ? isBomb
      ? "bg-gray-800 text-white"
      : "bg-gray-100 text-gray-100"
    : "bg-white border border-gray-200 text-gray-300";

  return (
    <div
      className={`bomb-card aspect-square rounded-2xl flex items-center justify-center transition-colors ${stateClasses} ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
      onClick={!disabled ? onClick : undefined}
    >
      {isRevealed ? (
        <span className="text-sm font-semibold">{isBomb ? "당첨" : ""}</span>
      ) : (
        <span className="text-2xl font-bold">?</span>
      )}
    </div>
  );
};
