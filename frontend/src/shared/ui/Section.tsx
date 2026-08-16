import type { ReactNode } from 'react';

export function Section({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-[var(--text)]">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
