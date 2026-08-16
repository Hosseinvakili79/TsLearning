import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAccessToken } from '../../shared/hooks/useAccessToken';
import { fa } from '../../shared/i18n/fa';
import type { Team } from '../../shared/types';
import { Alert } from '../../shared/ui/Alert';
import { Button } from '../../shared/ui/Button';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Input } from '../../shared/ui/Input';
import { PageHeader } from '../../shared/ui/PageHeader';
import { Spinner } from '../../shared/ui/Spinner';
import { Textarea } from '../../shared/ui/Textarea';
import * as teamsApi from './teamsApi';

export function TeamsPage() {
  const token = useAccessToken();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      setTeams(await teamsApi.listTeams(token));
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

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    await teamsApi.createTeam(token, {
      name: form.name,
      description: form.description || undefined,
    });
    setForm({ name: '', description: '' });
    setShowForm(false);
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title={fa.teams}
        description={fa.emptyTeamsHint}
        actions={
          <Button type="button" onClick={() => setShowForm((v) => !v)}>
            {showForm ? fa.cancel : fa.createTeam}
          </Button>
        }
      />
      {error && <Alert>{error}</Alert>}

      {showForm && (
        <form
          className="mb-8 max-w-lg space-y-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-subtle)]/50 p-4"
          onSubmit={onCreate}
        >
          <Input
            label={fa.name}
            required
            autoFocus
            value={form.name}
            onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
          />
          <Textarea
            label={fa.description}
            value={form.description}
            onChange={(e) =>
              setForm((c) => ({ ...c, description: e.target.value }))
            }
          />
          <div className="flex gap-2">
            <Button type="submit">{fa.create}</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              {fa.cancel}
            </Button>
          </div>
        </form>
      )}

      {teams.length === 0 ? (
        <EmptyState
          title={fa.emptyTeams}
          message={fa.emptyTeamsHint}
          action={
            <Button type="button" onClick={() => setShowForm(true)}>
              {fa.createTeam}
            </Button>
          }
        />
      ) : (
        <ul className="-mx-2">
          {teams.map((team) => (
            <li key={team.id}>
              <Link
                to={`/teams/${team.id}`}
                className="group flex items-center justify-between gap-3 rounded-[var(--radius)] px-3 py-3 transition-colors hover:bg-[var(--bg-subtle)]"
              >
                <div className="min-w-0">
                  <div className="font-medium group-hover:text-[var(--text)]">
                    {team.name}
                  </div>
                  {team.description && (
                    <div className="truncate text-sm text-[var(--text-muted)]">
                      {team.description}
                    </div>
                  )}
                </div>
                <span className="text-[var(--text-faint)] transition-transform group-hover:-translate-x-0.5">
                  ←
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
