import { fa } from '../i18n/fa';

export function Spinner() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 page-enter">
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--text)]"
        aria-hidden
      />
      <p className="text-sm text-[var(--text-muted)]">{fa.loading}</p>
    </div>
  );
}
