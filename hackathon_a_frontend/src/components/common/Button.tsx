import React from 'react';
import type { ButtonVariant, Size } from '../../types/common';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: Size;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-black text-white hover:bg-gray-900 disabled:bg-gray-300',
  secondary: 'bg-white text-black border border-gray-300 hover:bg-gray-50 disabled:text-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-200',
  ghost: 'bg-transparent text-black hover:bg-gray-100 disabled:text-gray-300',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-4 text-base font-medium rounded-2xl',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'cursor-pointer transition-colors disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
};
