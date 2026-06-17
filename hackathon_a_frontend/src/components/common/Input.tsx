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
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={[
          'w-full border-b border-gray-300 py-2 text-sm outline-none',
          'placeholder:text-gray-400',
          'focus:border-black transition-colors',
          'disabled:text-gray-300 disabled:cursor-not-allowed',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {showCount && maxLength && (
        <p className="mt-1 text-right text-xs text-gray-400">
          {value.length} / {maxLength}
        </p>
      )}
    </div>
  );
};
