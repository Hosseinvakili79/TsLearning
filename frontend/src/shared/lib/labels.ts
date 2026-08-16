import { fa } from '../i18n/fa';
import type { Priority, ProjectStatus, TaskStatus, TeamRole } from '../types';

export function statusLabel(status: TaskStatus | ProjectStatus): string {
  const map: Record<string, string> = {
    TODO: fa.todo,
    IN_PROGRESS: fa.inProgress,
    IN_REVIEW: fa.inReview,
    DONE: fa.done,
    CANCELLED: fa.cancelled,
    PLANNING: fa.planning,
    ACTIVE: fa.active,
    ON_HOLD: fa.onHold,
    COMPLETED: fa.completed,
    ARCHIVED: fa.archived,
  };
  return map[status] ?? status;
}

export function priorityLabel(priority: Priority): string {
  const map: Record<Priority, string> = {
    LOW: fa.low,
    MEDIUM: fa.medium,
    HIGH: fa.high,
    URGENT: fa.urgent,
  };
  return map[priority];
}

export function roleLabel(role: TeamRole): string {
  const map: Record<TeamRole, string> = {
    OWNER: fa.owner,
    ADMIN: fa.admin,
    MEMBER: fa.member,
  };
  return map[role];
}

export function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('fa-IR');
}
