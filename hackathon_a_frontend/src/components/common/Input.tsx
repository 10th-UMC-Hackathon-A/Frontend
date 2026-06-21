import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  maxLength?: number;
  showCount?: boolean;
  className?: string;
  variant?: 'underline' | 'rounded';
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  maxLength,
  showCount = false,
  className = '',
  variant = 'underline',
  onKeyDown,
}) => {
  const baseClasses =
    variant === 'rounded'
      ? 'w-full bg-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-gray-400 disabled:text-gray-300 disabled:cursor-not-allowed'
      : 'w-full border-b border-gray-300 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-black transition-colors disabled:text-gray-300 disabled:cursor-not-allowed';

  return (
    <div className="w-full">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        onKeyDown={onKeyDown}
        className={[baseClasses, className].filter(Boolean).join(' ')}
      />
      {showCount && maxLength && (
        <p className="mt-1 text-right text-xs text-gray-400">
          {value.length} / {maxLength}
        </p>
      )}
    </div>
  );
};
