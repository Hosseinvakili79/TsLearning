import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAccessToken } from '../../shared/hooks/useAccessToken';
import { fa } from '../../shared/i18n/fa';
import { roleLabel } from '../../shared/lib/labels';
import type { Project, Team, TeamMember, TeamRole } from '../../shared/types';
import { Alert } from '../../shared/ui/Alert';
import { Avatar } from '../../shared/ui/Avatar';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Input } from '../../shared/ui/Input';
import { PageHeader } from '../../shared/ui/PageHeader';
import { Section } from '../../shared/ui/Section';
import { Select } from '../../shared/ui/Select';
import { Spinner } from '../../shared/ui/Spinner';
import { StatusBadge } from '../../shared/ui/StatusBadge';
import * as projectsApi from '../projects/projectsApi';
import * as teamsApi from './teamsApi';

export function TeamDetailPage() {
  const { teamId = '' } = useParams();
  const token = useAccessToken();
  const [team, setTeam] = useState<(Team & { projects?: Project[] }) | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('MEMBER');
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    if (!token || !teamId) return;
    setLoading(true);
    try {
      const [teamData, memberData] = await Promise.all([
        teamsApi.getTeam(token, teamId),
        teamsApi.listMembers(token, teamId),
      ]);
      setTeam(teamData as Team & { projects?: Project[] });
      setMembers(memberData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : fa.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token, teamId]);

  const onInvite = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    try {
      await teamsApi.inviteMember(token, teamId, {
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail('');
      setMessage('دعوت‌نامه ارسال شد');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : fa.errorGeneric);
    }
  };

  const onCreateProject = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    await projectsApi.createProject(token, teamId, {
      name: projectForm.name,
      description: projectForm.description || undefined,
    });
    setProjectForm({ name: '', description: '' });
    await load();
  };

  if (loading) return <Spinner />;
  if (!team) return <EmptyState message={fa.empty} />;

  return (
    <div>
      <PageHeader
        title={team.name}
        description={team.description ?? undefined}
        breadcrumb={
          <Link className="hover:text-[var(--accent)]" to="/teams">
            {fa.teams}
          </Link>
        }
      />
      {error && <Alert>{error}</Alert>}
      {message && <Alert tone="success">{message}</Alert>}

      <Section title={fa.projects}>
        <form
          className="mb-4 grid gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-subtle)]/40 p-4 sm:grid-cols-[1fr_1fr_auto]"
          onSubmit={onCreateProject}
        >
          <Input
            label={fa.name}
            required
            value={projectForm.name}
            onChange={(e) => setProjectForm((c) => ({ ...c, name: e.target.value }))}
          />
          <Input
            label={fa.description}
            value={projectForm.description}
            onChange={(e) =>
              setProjectForm((c) => ({ ...c, description: e.target.value }))
            }
          />
          <Button type="submit" className="self-end">
            {fa.createProject}
          </Button>
        </form>
        {(team.projects?.length ?? 0) === 0 ? (
          <EmptyState title={fa.emptyProjects} message={fa.empty} />
        ) : (
          <ul className="-mx-2">
            {team.projects?.map((project) => (
              <li key={project.id}>
                <Link
                  className="flex items-center justify-between rounded-[var(--radius)] px-2 py-2.5 transition-colors hover:bg-[var(--bg-subtle)]"
                  to={`/projects/${project.id}`}
                >
                  <span className="font-medium">{project.name}</span>
                  <StatusBadge status={project.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={fa.members}>
        <ul className="mb-4 -mx-2">
          {members.map((member) => {
            const name = member.user
              ? `${member.user.firstName} ${member.user.lastName}`
              : member.userId;
            return (
              <li
                key={member.userId}
                className="flex items-center justify-between rounded-[var(--radius)] px-2 py-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar name={name} size="sm" />
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    {member.user?.email && (
                      <div className="text-xs text-[var(--text-faint)]">
                        {member.user.email}
                      </div>
                    )}
                  </div>
                </div>
                <Badge tone="muted">{roleLabel(member.role)}</Badge>
              </li>
            );
          })}
        </ul>

        <form
          className="flex flex-wrap items-end gap-3 rounded-[var(--radius)] border border-[var(--border)] p-4"
          onSubmit={onInvite}
        >
          <Input
            label={fa.email}
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <Select
            label={fa.role}
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as TeamRole)}
          >
            <option value="MEMBER">{fa.member}</option>
            <option value="ADMIN">{fa.admin}</option>
          </Select>
          <Button type="submit">{fa.invite}</Button>
        </form>
      </Section>
    </div>
  );
}
