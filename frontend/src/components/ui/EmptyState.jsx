import React from 'react';
import { cn } from '../../utils/cn';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500",
      className
    )}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100/50 mb-4">
        {Icon && <Icon className="h-10 w-10 text-slate-600" strokeWidth={1.5} />}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};
