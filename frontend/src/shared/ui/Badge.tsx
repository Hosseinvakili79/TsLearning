import type { ReactNode } from 'react';

type Tone = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'muted';

const tones: Record<Tone, string> = {
  default: 'bg-[var(--bg-subtle)] text-[var(--text)]',
  accent: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  success: 'bg-[var(--success-soft)] text-[var(--success)]',
  warning: 'bg-[var(--warning-soft)] text-[var(--warning)]',
  danger: 'bg-[var(--danger-soft)] text-[var(--danger)]',
  muted: 'bg-[var(--bg-hover)] text-[var(--text-muted)]',
};

export function Badge({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-4 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
