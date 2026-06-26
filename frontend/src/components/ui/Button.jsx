import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const buttonVariants = {
  default: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm hover:shadow-[0_0_15px_var(--primary-glow)]',
  secondary: 'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)] shadow-sm',
  destructive: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20',
  outline: 'border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white',
  ghost: 'hover:bg-white/5 text-slate-700 hover:text-white',
  link: 'text-[var(--primary)] underline-offset-4 hover:underline',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3 text-sm',
  lg: 'h-11 rounded-md px-8 text-lg',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  isLoading = false, 
  disabled, 
  children, 
  type = 'button',
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      disabled={isLoading || disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
