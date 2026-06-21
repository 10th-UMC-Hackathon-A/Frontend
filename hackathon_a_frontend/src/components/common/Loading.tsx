import React from 'react';

interface LoadingProps {
  message?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </div>
  );
};
