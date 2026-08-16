import type { ReactNode } from 'react';

export function EmptyState({
  title,
  message,
  action,
}: {
  title?: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--border)] bg-[var(--bg-subtle)]/50 px-6 py-14 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--text-faint)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 7h16M4 12h10M4 17h14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {title && <p className="mb-1 text-sm font-medium text-[var(--text)]">{title}</p>}
      <p className="max-w-xs text-sm text-[var(--text-muted)]">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
