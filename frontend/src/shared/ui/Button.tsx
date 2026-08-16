import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--text)] text-white hover:opacity-90 active:opacity-80 disabled:opacity-40',
  secondary:
    'bg-[var(--bg-subtle)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg-hover)] disabled:opacity-40',
  ghost:
    'bg-transparent text-[var(--text)] hover:bg-[var(--bg-hover)] disabled:opacity-40',
  danger:
    'bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[#f9dede] disabled:opacity-40',
};

const sizes: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-[var(--radius)] font-medium transition-colors duration-150 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
