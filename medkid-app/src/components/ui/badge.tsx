import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'calm' | 'concerned' | 'panic';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const variants = {
    default: 'bg-primary text-primary-foreground border-transparent',
    secondary: 'bg-secondary text-secondary-foreground border-transparent',
    destructive: 'bg-destructive text-destructive-foreground border-transparent',
    outline: 'border border-border text-foreground bg-white',
    // Clinical custom states
    calm: 'bg-teal-50 text-teal-700 border border-teal-200/50 shadow-xs',
    concerned: 'bg-amber-50 text-amber-700 border border-amber-200/50 shadow-xs',
    panic: 'bg-red-50 text-red-700 border border-red-200/50 shadow-xs animate-pulse-slow font-bold shadow-red-200/50 shadow-md',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
}

export { Badge };
