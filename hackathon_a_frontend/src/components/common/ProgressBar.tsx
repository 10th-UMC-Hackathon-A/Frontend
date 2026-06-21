import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  className?: string;
  barClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
  className = '',
  barClassName = 'bg-black',
}) => {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-gray-800">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-bold text-gray-800">{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClassName}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
