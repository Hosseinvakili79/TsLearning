import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}) {
  return (
    <div className="mb-8">
      {breadcrumb && <div className="mb-2 text-xs text-[var(--text-faint)]">{breadcrumb}</div>}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-[var(--text)]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
