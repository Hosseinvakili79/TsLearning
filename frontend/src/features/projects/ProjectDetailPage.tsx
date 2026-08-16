import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAccessToken } from '../../shared/hooks/useAccessToken';
import { fa } from '../../shared/i18n/fa';
import {
  formatDate,
  priorityLabel,
  roleLabel,
  statusLabel,
} from '../../shared/lib/labels';
import type {
  Activity,
  Comment,
  Label,
  Priority,
  Project,
  Task,
  TaskStatus,
} from '../../shared/types';
import { Alert } from '../../shared/ui/Alert';
import { Avatar } from '../../shared/ui/Avatar';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Input } from '../../shared/ui/Input';
import { PageHeader } from '../../shared/ui/PageHeader';
import { Select } from '../../shared/ui/Select';
import { Spinner } from '../../shared/ui/Spinner';
import { PriorityBadge, StatusBadge } from '../../shared/ui/StatusBadge';
import { Textarea } from '../../shared/ui/Textarea';
import * as projectsApi from '../projects/projectsApi';
import * as tasksApi from '../tasks/tasksApi';
import * as teamsApi from '../teams/teamsApi';

type Tab = 'overview' | 'tasks' | 'members' | 'activity' | 'settings';

const taskStatuses: TaskStatus[] = [
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'DONE',
  'CANCELLED',
];

export function ProjectDetailPage() {
  const { projectId = '' } = useParams();
  const token = useAccessToken();
  const [tab, setTab] = useState<Tab>('tasks');
  const [view, setView] = useState<'list' | 'kanban'>('kanban');
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as Priority,
    assigneeId: '',
  });
  const [labelName, setLabelName] = useState('');
  const [memberUserId, setMemberUserId] = useState('');
  const [teamMembers, setTeamMembers] = useState<
    Array<{ userId: string; user?: { firstName: string; lastName: string; email: string } }>
  >([]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );

  const load = async () => {
    if (!token || !projectId) return;
    setLoading(true);
    try {
      const [projectData, taskData, labelData, activityData] = await Promise.all([
        projectsApi.getProject(token, projectId),
        tasksApi.listTasks(token, projectId),
        tasksApi.listLabels(token, projectId),
        tasksApi.listActivities(token, projectId),
      ]);
      setProject(projectData);
      setTasks(taskData);
      setLabels(labelData);
      setActivities(activityData);
      const members = await teamsApi.listMembers(token, projectData.teamId);
      setTeamMembers(members);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : fa.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token, projectId]);

  useEffect(() => {
    const loadComments = async () => {
      if (!token || !selectedTaskId) {
        setComments([]);
        return;
      }
      setComments(await tasksApi.listComments(token, selectedTaskId));
    };
    void loadComments();
  }, [token, selectedTaskId]);

  const onCreateTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    await tasksApi.createTask(token, projectId, {
      title: taskForm.title,
      description: taskForm.description || undefined,
      priority: taskForm.priority,
      assigneeId: taskForm.assigneeId || undefined,
    });
    setTaskForm({ title: '', description: '', priority: 'MEDIUM', assigneeId: '' });
    await load();
  };

  const onStatusChange = async (taskId: string, status: TaskStatus) => {
    if (!token) return;
    await tasksApi.updateTask(token, taskId, { status });
    await load();
  };

  const onAddComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !selectedTaskId || !commentText.trim()) return;
    await tasksApi.createComment(token, selectedTaskId, commentText.trim());
    setCommentText('');
    setComments(await tasksApi.listComments(token, selectedTaskId));
  };

  const onCreateLabel = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !labelName.trim()) return;
    await tasksApi.createLabel(token, projectId, { name: labelName.trim() });
    setLabelName('');
    await load();
  };

  const onAddMember = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !memberUserId) return;
    await projectsApi.addProjectMember(token, projectId, { userId: memberUserId });
    setMemberUserId('');
    await load();
  };

  const onSaveSettings = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !project) return;
    await projectsApi.updateProject(token, project.id, {
      name: project.name,
      description: project.description ?? undefined,
      status: project.status,
      priority: project.priority,
    });
    await load();
  };

  if (loading) return <Spinner />;
  if (!project) return <EmptyState message={fa.empty} />;

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'overview', label: fa.overview },
    { id: 'tasks', label: fa.tasks },
    { id: 'members', label: fa.members },
    { id: 'activity', label: fa.activity },
    { id: 'settings', label: fa.settings },
  ];

  return (
    <div>
      <PageHeader
        title={project.name}
        breadcrumb={
          <Link className="hover:text-[var(--accent)]" to={`/teams/${project.teamId}`}>
            {fa.teams}
          </Link>
        }
        description={project.description ?? undefined}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
        }
      />
      {error && <Alert>{error}</Alert>}

      <div className="mb-6 flex flex-wrap gap-1 rounded-[var(--radius)] bg-[var(--bg-subtle)] p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rounded-[var(--radius)] px-3 py-1.5 text-sm transition-colors ${
              tab === item.id
                ? 'bg-white font-medium shadow-[0_1px_2px_rgba(55,53,47,0.06)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[var(--radius)] border border-[var(--border)] px-4 py-3">
            <div className="text-xs text-[var(--text-muted)]">{fa.dueDate}</div>
            <div className="mt-1 font-medium">{formatDate(project.dueDate)}</div>
          </div>
          <div className="rounded-[var(--radius)] border border-[var(--border)] px-4 py-3">
            <div className="text-xs text-[var(--text-muted)]">{fa.tasks}</div>
            <div className="mt-1 font-medium tabular-nums">
              {tasks.length.toLocaleString('fa-IR')}
            </div>
          </div>
          <div className="rounded-[var(--radius)] border border-[var(--border)] px-4 py-3">
            <div className="text-xs text-[var(--text-muted)]">{fa.members}</div>
            <div className="mt-1 font-medium tabular-nums">
              {(project.members?.length ?? 0).toLocaleString('fa-IR')}
            </div>
          </div>
        </div>
      )}

      {tab === 'tasks' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-4 inline-flex rounded-[var(--radius)] bg-[var(--bg-subtle)] p-1">
              <Button
                type="button"
                size="sm"
                variant={view === 'list' ? 'secondary' : 'ghost'}
                onClick={() => setView('list')}
              >
                {fa.listView}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={view === 'kanban' ? 'secondary' : 'ghost'}
                onClick={() => setView('kanban')}
              >
                {fa.kanbanView}
              </Button>
            </div>

            <form
              className="mb-6 space-y-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-subtle)]/40 p-4"
              onSubmit={onCreateTask}
            >
              <Input
                label={fa.title}
                required
                placeholder={fa.createTask}
                value={taskForm.title}
                onChange={(e) => setTaskForm((c) => ({ ...c, title: e.target.value }))}
              />
              <Textarea
                label={fa.description}
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm((c) => ({ ...c, description: e.target.value }))
                }
              />
              <div className="flex flex-wrap items-end gap-3">
                <Select
                  label={fa.priority}
                  value={taskForm.priority}
                  onChange={(e) =>
                    setTaskForm((c) => ({
                      ...c,
                      priority: e.target.value as Priority,
                    }))
                  }
                >
                  {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as Priority[]).map((p) => (
                    <option key={p} value={p}>
                      {priorityLabel(p)}
                    </option>
                  ))}
                </Select>
                <Select
                  label={fa.assignee}
                  value={taskForm.assigneeId}
                  onChange={(e) =>
                    setTaskForm((c) => ({ ...c, assigneeId: e.target.value }))
                  }
                >
                  <option value="">—</option>
                  {project.members?.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.user
                        ? `${member.user.firstName} ${member.user.lastName}`
                        : member.userId}
                    </option>
                  ))}
                </Select>
                <Button type="submit">{fa.createTask}</Button>
              </div>
            </form>

            {view === 'list' ? (
              tasks.length === 0 ? (
                <EmptyState title={fa.emptyTasks} message={fa.empty} />
              ) : (
                <ul className="-mx-2">
                  {tasks.map((task) => (
                    <li key={task.id}>
                      <button
                        type="button"
                        className={`flex w-full items-center justify-between gap-3 rounded-[var(--radius)] px-3 py-2.5 text-start transition-colors hover:bg-[var(--bg-subtle)] ${
                          selectedTaskId === task.id ? 'bg-[var(--bg-subtle)]' : ''
                        }`}
                        onClick={() => setSelectedTaskId(task.id)}
                      >
                        <span className="font-medium">{task.title}</span>
                        <div className="flex items-center gap-1.5">
                          <PriorityBadge priority={task.priority} />
                          <StatusBadge status={task.status} />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {taskStatuses
                  .filter((status) => status !== 'CANCELLED')
                  .map((status) => {
                    const columnTasks = tasks.filter((task) => task.status === status);
                    return (
                      <div
                        key={status}
                        className="rounded-[var(--radius)] bg-[var(--bg-subtle)] p-2"
                      >
                        <div className="mb-2 flex items-center justify-between px-1">
                          <StatusBadge status={status} />
                          <span className="text-[11px] tabular-nums text-[var(--text-faint)]">
                            {columnTasks.length.toLocaleString('fa-IR')}
                          </span>
                        </div>
                        <div className="min-h-16 space-y-2">
                          {columnTasks.map((task) => (
                            <button
                              key={task.id}
                              type="button"
                              className={`block w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-2.5 py-2 text-start text-sm shadow-[0_1px_1px_rgba(55,53,47,0.03)] transition-colors hover:border-[var(--border-strong)] ${
                                selectedTaskId === task.id
                                  ? 'ring-1 ring-[var(--accent)]'
                                  : ''
                              }`}
                              onClick={() => setSelectedTaskId(task.id)}
                            >
                              <div className="font-medium leading-snug">{task.title}</div>
                              <div className="mt-1.5">
                                <PriorityBadge priority={task.priority} />
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {taskStatuses
                                  .filter((s) => s !== task.status && s !== 'CANCELLED')
                                  .slice(0, 2)
                                  .map((next) => (
                                    <button
                                      key={next}
                                      type="button"
                                      className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        void onStatusChange(task.id, next);
                                      }}
                                    >
                                      → {statusLabel(next)}
                                    </button>
                                  ))}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-[var(--radius)] border border-[var(--border)] p-4">
            {selectedTask ? (
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="text-base font-semibold">{selectedTask.title}</h3>
                  <p className="mt-1 text-[var(--text-muted)]">
                    {selectedTask.description || '—'}
                  </p>
                </div>
                <Select
                  label={fa.status}
                  value={selectedTask.status}
                  onChange={(e) =>
                    void onStatusChange(selectedTask.id, e.target.value as TaskStatus)
                  }
                >
                  {taskStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </Select>
                <div>
                  <div className="mb-2 text-xs font-medium text-[var(--text-muted)]">
                    {fa.comments}
                  </div>
                  <ul className="mb-3 max-h-52 space-y-3 overflow-auto">
                    {comments.length === 0 && (
                      <li className="text-xs text-[var(--text-faint)]">{fa.empty}</li>
                    )}
                    {comments.map((comment) => {
                      const name = comment.author
                        ? `${comment.author.firstName} ${comment.author.lastName}`
                        : '—';
                      return (
                        <li key={comment.id} className="flex gap-2">
                          <Avatar name={name} size="sm" />
                          <div>
                            <div className="text-[11px] text-[var(--text-faint)]">
                              {name} · {formatDate(comment.createdAt)}
                            </div>
                            <div>{comment.content}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <form className="space-y-2" onSubmit={onAddComment}>
                    <Textarea
                      label={fa.addComment}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button type="submit" size="sm">
                      {fa.addComment}
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">{fa.selectTask}</p>
            )}
          </aside>
        </div>
      )}

      {tab === 'members' && (
        <div>
          <ul className="mb-4 -mx-2">
            {project.members?.map((member) => {
              const name = member.user
                ? `${member.user.firstName} ${member.user.lastName}`
                : member.userId;
              return (
                <li
                  key={member.userId}
                  className="flex items-center justify-between rounded-[var(--radius)] px-2 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Avatar name={name} size="sm" />
                    <span>{name}</span>
                  </div>
                  <Badge tone="muted">{roleLabel(member.role)}</Badge>
                </li>
              );
            })}
          </ul>
          <form className="flex flex-wrap items-end gap-3" onSubmit={onAddMember}>
            <Select
              label={fa.members}
              value={memberUserId}
              onChange={(e) => setMemberUserId(e.target.value)}
              required
            >
              <option value="">—</option>
              {teamMembers
                .filter(
                  (member) =>
                    !project.members?.some((pm) => pm.userId === member.userId),
                )
                .map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.user
                      ? `${member.user.firstName} ${member.user.lastName} (${member.user.email})`
                      : member.userId}
                  </option>
                ))}
            </Select>
            <Button type="submit">{fa.create}</Button>
          </form>
        </div>
      )}

      {tab === 'activity' &&
        (activities.length === 0 ? (
          <EmptyState message={fa.emptyActivity} />
        ) : (
          <ul className="-mx-2">
            {activities.map((item) => {
              const name = item.actor
                ? `${item.actor.firstName} ${item.actor.lastName}`
                : '—';
              return (
                <li key={item.id} className="flex gap-3 rounded-[var(--radius)] px-2 py-2.5">
                  <Avatar name={name} size="sm" />
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">{name}</span>
                      <span className="text-[var(--text-muted)]"> · {item.action}</span>
                    </div>
                    <div className="text-xs text-[var(--text-faint)]">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ))}

      {tab === 'settings' && (
        <div className="max-w-lg space-y-8">
          <form className="space-y-3" onSubmit={onSaveSettings}>
            <Input
              label={fa.name}
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
            <Textarea
              label={fa.description}
              value={project.description ?? ''}
              onChange={(e) =>
                setProject({ ...project, description: e.target.value })
              }
            />
            <Button type="submit">{fa.save}</Button>
          </form>

          <div>
            <h3 className="mb-3 text-sm font-semibold">{fa.labels}</h3>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {labels.length === 0 ? (
                <span className="text-sm text-[var(--text-faint)]">{fa.empty}</span>
              ) : (
                labels.map((label) => (
                  <Badge key={label.id}>{label.name}</Badge>
                ))
              )}
            </div>
            <form className="flex items-end gap-2" onSubmit={onCreateLabel}>
              <Input
                label={fa.name}
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
              />
              <Button type="submit">{fa.create}</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
