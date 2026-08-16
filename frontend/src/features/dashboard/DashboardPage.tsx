import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccessToken } from '../../shared/hooks/useAccessToken';
import { fa } from '../../shared/i18n/fa';
import { formatDate } from '../../shared/lib/labels';
import type { DashboardData } from '../../shared/types';
import { Alert } from '../../shared/ui/Alert';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import { EmptyState } from '../../shared/ui/EmptyState';
import { PageHeader } from '../../shared/ui/PageHeader';
import { Section } from '../../shared/ui/Section';
import { Spinner } from '../../shared/ui/Spinner';
import { StatusBadge } from '../../shared/ui/StatusBadge';
import * as tasksApi from '../tasks/tasksApi';

export function DashboardPage() {
  const token = useAccessToken();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      try {
        setData(await tasksApi.getDashboard(token));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : fa.errorGeneric);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [token]);

  if (loading) return <Spinner />;
  if (!data) return <EmptyState message={error ?? fa.empty} />;

  const taskRows = [
    { label: fa.todo, value: data.tasksByStatus.TODO ?? 0 },
    { label: fa.inProgress, value: data.tasksByStatus.IN_PROGRESS ?? 0 },
    { label: fa.inReview, value: data.tasksByStatus.IN_REVIEW ?? 0 },
    { label: fa.done, value: data.tasksByStatus.DONE ?? 0 },
  ];
  const maxTask = Math.max(...taskRows.map((row) => row.value), 1);

  return (
    <div>
      <PageHeader title={fa.dashboard} description={fa.welcome} />
      {error && <Alert>{error}</Alert>}

      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={fa.projects} value={data.projectsCount} />
        <Stat label={fa.overdue} value={data.overdueCount} emphasize={data.overdueCount > 0} />
        <Stat label={fa.dueToday} value={data.dueTodayCount} />
        <Stat
          label={fa.myTasks}
          value={Object.values(data.tasksByStatus).reduce((a, b) => a + b, 0)}
        />
      </div>

      <Section title={fa.myTasks}>
        <div className="space-y-3">
          {taskRows.map((row) => (
            <div key={row.label} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-3 text-sm">
              <span className="text-[var(--text-muted)]">{row.label}</span>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                <div
                  className="h-full rounded-full bg-[var(--text)] transition-all"
                  style={{ width: `${(row.value / maxTask) * 100}%` }}
                />
              </div>
              <span className="text-end tabular-nums">
                {row.value.toLocaleString('fa-IR')}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={fa.myProjects}
        actions={
          <Link to="/teams">
            <Button variant="ghost" size="sm">
              {fa.teams}
            </Button>
          </Link>
        }
      >
        {data.recentProjects.length === 0 ? (
          <EmptyState
            title={fa.emptyProjects}
            message={fa.emptyTeamsHint}
            action={
              <Link to="/teams">
                <Button size="sm">{fa.createTeam}</Button>
              </Link>
            }
          />
        ) : (
          <ul className="-mx-2">
            {data.recentProjects.map((project) => (
              <li key={project.id}>
                <Link
                  to={`/projects/${project.id}`}
                  className="flex items-center justify-between gap-3 rounded-[var(--radius)] px-2 py-2.5 transition-colors hover:bg-[var(--bg-subtle)]"
                >
                  <span className="font-medium">{project.name}</span>
                  <StatusBadge status={project.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={fa.recentActivity}>
        {data.recentActivity.length === 0 ? (
          <EmptyState message={fa.emptyActivity} />
        ) : (
          <ul className="-mx-2">
            {data.recentActivity.map((item) => {
              const name = item.actor
                ? `${item.actor.firstName} ${item.actor.lastName}`
                : '—';
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-[var(--radius)] px-2 py-2.5"
                >
                  <Avatar name={name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{name}</span>
                      <span className="text-[var(--text-muted)]"> · {item.action}</span>
                    </p>
                    <p className="text-xs text-[var(--text-faint)]">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Stat({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: number;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-subtle)]/60 px-4 py-3">
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
      <div
        className={`mt-1 text-2xl font-semibold tabular-nums ${
          emphasize ? 'text-[var(--danger)]' : ''
        }`}
      >
        {value.toLocaleString('fa-IR')}
      </div>
    </div>
  );
}
