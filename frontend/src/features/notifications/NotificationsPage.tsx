import { useEffect, useState } from 'react';
import { useAccessToken } from '../../shared/hooks/useAccessToken';
import { fa } from '../../shared/i18n/fa';
import { formatDate } from '../../shared/lib/labels';
import type { NotificationItem } from '../../shared/types';
import { Alert } from '../../shared/ui/Alert';
import { Button } from '../../shared/ui/Button';
import { EmptyState } from '../../shared/ui/EmptyState';
import { PageHeader } from '../../shared/ui/PageHeader';
import { Spinner } from '../../shared/ui/Spinner';
import * as tasksApi from '../tasks/tasksApi';

export function NotificationsPage() {
  const token = useAccessToken();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      setItems(await tasksApi.listNotifications(token));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : fa.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  const onMarkRead = async (id: string) => {
    if (!token) return;
    await tasksApi.markNotificationRead(token, id);
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title={fa.notifications} />
      {error && <Alert>{error}</Alert>}
      {items.length === 0 ? (
        <EmptyState title={fa.emptyNotifications} message={fa.empty} />
      ) : (
        <ul className="-mx-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex items-start justify-between gap-3 rounded-[var(--radius)] px-3 py-3 ${
                item.readAt ? 'opacity-55' : 'bg-[var(--bg-subtle)]/70'
              }`}
            >
              <div className="flex gap-3">
                {!item.readAt && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                )}
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.body && (
                    <div className="mt-0.5 text-sm text-[var(--text-muted)]">{item.body}</div>
                  )}
                  <div className="mt-1 text-xs text-[var(--text-faint)]">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
              {!item.readAt && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void onMarkRead(item.id)}
                >
                  {fa.markRead}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
