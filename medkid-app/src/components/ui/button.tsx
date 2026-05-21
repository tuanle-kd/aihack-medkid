import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-250 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer';

    const variants = {
      default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/95 hover:shadow-md hover:-translate-y-[1px]',
      destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/95 hover:shadow-md hover:-translate-y-[1px]',
      outline: 'border border-border bg-white text-foreground hover:bg-muted hover:border-muted-foreground/20 hover:shadow-xs',
      secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/95 hover:shadow-md hover:-translate-y-[1px]',
      ghost: 'hover:bg-muted hover:text-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-xl px-3 text-xs',
      lg: 'h-12 rounded-3xl px-8 text-base',
      icon: 'h-10 w-10',
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
