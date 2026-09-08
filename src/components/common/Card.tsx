import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'pastel-yellow' | 'pastel-teal' | 'pastel-purple' | 'pastel-rose' | 'slate';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  interactive = false,
  className = '',
  ...rest
}) => {
  const variantStyles = {
    white: 'bg-white border-2 border-slate-200/80 shadow-sm text-slate-800',
    'pastel-yellow': 'bg-amber-50/90 border-2 border-amber-200/90 shadow-sm text-amber-950',
    'pastel-teal': 'bg-teal-50/90 border-2 border-teal-200/90 shadow-sm text-teal-950',
    'pastel-purple': 'bg-purple-50/90 border-2 border-purple-200/90 shadow-sm text-purple-950',
    'pastel-rose': 'bg-rose-50/90 border-2 border-rose-200/90 shadow-sm text-rose-950',
    slate: 'bg-slate-900 border-2 border-slate-800 text-white shadow-md',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:shadow-sm'
    : '';

  return (
    <div
      className={`rounded-3xl p-5 md:p-6 ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
