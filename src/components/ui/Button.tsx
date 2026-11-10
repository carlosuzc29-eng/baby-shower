import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-2xl btn-interactive cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A8D1EE] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-sm min-h-[38px]',
    md: 'px-5 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3.5 text-lg min-h-[52px]',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-b from-[#F7931E] to-[#E2650F] text-white shadow-[0_6px_16px_-8px_rgba(226,101,15,0.7)] hover:brightness-105 active:scale-[0.97]',
    secondary: 'bg-theme-secondary-light text-theme border border-theme shadow-xs hover:bg-white',
    outline: 'border-2 border-[#F7931E] text-[#E2650F] hover:bg-theme-accent-light',
    ghost: 'text-theme hover:bg-black/5',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
