import type { SelectHTMLAttributes, ReactNode } from 'react';

export function Select({
  label,
  className = '',
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && (
        <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
      )}
      <select
        className={`rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 py-2 transition-colors hover:border-[var(--border-strong)] focus:border-[var(--accent)] ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
