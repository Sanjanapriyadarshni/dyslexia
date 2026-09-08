import React from 'react';
import { soundEngine } from '../../hooks/useSound';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'teal' | 'coral' | 'indigo' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  soundType?: 'click' | 'success' | 'pop' | 'none';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'lg',
  soundType = 'click',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  onClick,
  disabled,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      if (soundType === 'click') soundEngine.playClick();
      else if (soundType === 'success') soundEngine.playSuccess();
      else if (soundType === 'pop') soundEngine.playPop();
      if (onClick) onClick(e);
    }
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-bold tracking-wide transition-all select-none rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-1.5 shadow-[0_3px_0_0_rgba(0,0,0,0.12)] active:translate-y-0.5 active:shadow-[0_1px_0_0_rgba(0,0,0,0.12)]',
    md: 'px-5 py-2.5 text-base gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.14)] active:translate-y-1 active:shadow-[0_1px_0_0_rgba(0,0,0,0.12)]',
    lg: 'px-7 py-3.5 text-lg gap-2.5 shadow-[0_5px_0_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.12)] min-h-[52px]',
    xl: 'px-8 py-4 text-xl gap-3 shadow-[0_6px_0_0_rgba(0,0,0,0.18)] active:translate-y-1.5 active:shadow-[0_2px_0_0_rgba(0,0,0,0.12)] min-h-[60px] rounded-3xl',
  };

  const variantStyles = {
    primary:
      'bg-amber-400 hover:bg-amber-300 text-amber-950 border-2 border-amber-500/30 hover:border-amber-500 shadow-amber-600/30',
    teal:
      'bg-teal-600 hover:bg-teal-500 text-white border-2 border-teal-700/40 shadow-teal-900/30',
    coral:
      'bg-rose-500 hover:bg-rose-400 text-white border-2 border-rose-600/40 shadow-rose-900/30',
    indigo:
      'bg-indigo-600 hover:bg-indigo-500 text-white border-2 border-indigo-700/40 shadow-indigo-900/30',
    outline:
      'bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 shadow-slate-300',
    ghost:
      'bg-transparent hover:bg-slate-200/60 text-slate-700 border-transparent shadow-none active:translate-y-0',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...rest}
    >
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
