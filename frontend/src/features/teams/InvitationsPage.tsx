import { useEffect, useState } from 'react';
import { useAccessToken } from '../../shared/hooks/useAccessToken';
import { fa } from '../../shared/i18n/fa';
import type { Invitation } from '../../shared/types';
import { Alert } from '../../shared/ui/Alert';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { EmptyState } from '../../shared/ui/EmptyState';
import { PageHeader } from '../../shared/ui/PageHeader';
import { Spinner } from '../../shared/ui/Spinner';
import { roleLabel } from '../../shared/lib/labels';
import * as teamsApi from '../teams/teamsApi';

export function InvitationsPage() {
  const token = useAccessToken();
  const [items, setItems] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      setItems(await teamsApi.listInvitations(token));
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

  const onAccept = async (inviteToken: string) => {
    if (!token) return;
    await teamsApi.acceptInvitation(token, inviteToken);
    await load();
  };

  const onReject = async (inviteToken: string) => {
    if (!token) return;
    await teamsApi.rejectInvitation(token, inviteToken);
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title={fa.invitations} />
      {error && <Alert>{error}</Alert>}
      {items.length === 0 ? (
        <EmptyState title={fa.emptyInvites} message={fa.empty} />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--border)] px-4 py-3"
            >
              <div>
                <div className="font-medium">{item.team?.name ?? item.teamId}</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Badge tone="muted">{roleLabel(item.role)}</Badge>
                  <span>{item.email}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={() => void onAccept(item.token)}>
                  {fa.accept}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void onReject(item.token)}
                >
                  {fa.reject}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
