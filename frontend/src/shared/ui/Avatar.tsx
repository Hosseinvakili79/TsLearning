export function Avatar({
  name,
  size = 'md',
}: {
  name: string;
  size?: 'sm' | 'md';
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const sizeClass = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs';

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--bg-active)] font-medium text-[var(--text)] ${sizeClass}`}
      aria-hidden
    >
      {initials || '?'}
    </span>
  );
}
