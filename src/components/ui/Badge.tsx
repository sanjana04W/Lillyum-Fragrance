import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'gold' | 'new' | 'sale' | 'green' | 'gray' | 'red' | 'orange' | 'amber';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  gold:   'bg-brand-gold-soft text-brand-gold-dark border border-brand-gold/30',
  new:    'bg-emerald-50  text-emerald-700 border border-emerald-200',
  sale:   'bg-red-50      text-red-600     border border-red-200',
  green:  'bg-emerald-50  text-emerald-700 border border-emerald-200',
  gray:   'bg-brand-ivory text-brand-mid   border border-brand-light',
  red:    'bg-red-50      text-red-600     border border-red-200',
  orange: 'bg-amber-50    text-amber-700   border border-amber-200',
  amber:  'bg-amber-50    text-amber-700   border border-amber-200',
};

const sizes: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2    py-0.5 text-[10px]',
  md: 'px-2.5  py-1   text-xs',
};

export default function Badge({ variant = 'gold', size = 'md', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-semibold uppercase tracking-wide rounded-full',
      variants[variant],
      sizes[size],
      className,
    )}>
      {children}
    </span>
  );
}
