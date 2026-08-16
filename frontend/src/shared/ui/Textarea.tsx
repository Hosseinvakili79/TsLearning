import type { TextareaHTMLAttributes } from 'react';

export function Textarea({
  className = '',
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label && (
        <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
      )}
      <textarea
        className={`min-h-24 w-full resize-y rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 py-2 transition-colors placeholder:text-[var(--text-faint)] hover:border-[var(--border-strong)] focus:border-[var(--accent)] ${className}`}
        {...props}
      />
    </label>
  );
}
