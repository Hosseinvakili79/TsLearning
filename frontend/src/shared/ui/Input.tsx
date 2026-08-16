import type { InputHTMLAttributes } from 'react';

export function Input({
  className = '',
  label,
  hint,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label && (
        <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
      )}
      <input
        className={`w-full rounded-[var(--radius)] border bg-white px-3 py-2 text-[var(--text)] transition-colors placeholder:text-[var(--text-faint)] ${
          error
            ? 'border-[var(--danger)]'
            : 'border-[var(--border)] hover:border-[var(--border-strong)] focus:border-[var(--accent)]'
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="text-xs text-[var(--danger)]">{error}</span>
      ) : hint ? (
        <span className="text-xs text-[var(--text-faint)]">{hint}</span>
      ) : null}
    </label>
  );
}
