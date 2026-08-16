export function Alert({
  children,
  tone = 'danger',
}: {
  children: string;
  tone?: 'danger' | 'success' | 'info';
}) {
  const styles =
    tone === 'success'
      ? 'bg-[var(--success-soft)] text-[var(--success)]'
      : tone === 'info'
        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
        : 'bg-[var(--danger-soft)] text-[var(--danger)]';

  return (
    <div className={`mb-4 rounded-[var(--radius)] px-3 py-2 text-sm ${styles}`}>
      {children}
    </div>
  );
}
