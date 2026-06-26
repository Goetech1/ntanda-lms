import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border border-slate-300 bg-white/50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500/50 focus-visible:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
