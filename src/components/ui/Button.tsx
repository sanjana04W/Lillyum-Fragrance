import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-brand-gold text-white hover:bg-brand-gold-dark shadow-gold hover:shadow-gold-lg border border-brand-gold-dark/20',
  secondary: 'bg-brand-charcoal text-white hover:bg-brand-dark border border-brand-charcoal',
  outline:   'border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white',
  ghost:     'text-brand-mid hover:text-brand-gold hover:bg-brand-gold-soft border border-transparent',
  danger:    'bg-red-500 text-white hover:bg-red-600 border border-red-600',
  white:     'bg-white text-brand-charcoal hover:bg-brand-cream border border-brand-light shadow-soft',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  xs: 'px-2.5 py-1   text-xs  rounded-lg  gap-1',
  sm: 'px-3.5 py-1.5 text-xs  rounded-xl  gap-1.5',
  md: 'px-5   py-2.5 text-sm  rounded-xl  gap-2',
  lg: 'px-6   py-3   text-sm  rounded-xl  gap-2  font-semibold',
  xl: 'px-8   py-4   text-base rounded-2xl gap-2.5 font-semibold',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
