import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, fullWidth = true, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-brand-dark">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-brand-white border border-brand-light rounded-xl px-4 py-3 text-brand-charcoal text-sm placeholder-brand-muted',
            'focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold',
            'transition-all duration-200',
            error && 'border-red-400 focus:ring-red-300 focus:border-red-400',
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-brand-muted">{hint}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
