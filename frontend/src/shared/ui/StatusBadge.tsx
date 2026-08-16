import type { Priority, ProjectStatus, TaskStatus } from '../types';
import type { ComponentProps } from 'react';
import { Badge } from '../ui/Badge';
import { priorityLabel, statusLabel } from '../lib/labels';

type Tone = ComponentProps<typeof Badge>['tone'];

export function taskStatusTone(status: TaskStatus): Tone {
  switch (status) {
    case 'TODO':
      return 'muted';
    case 'IN_PROGRESS':
      return 'accent';
    case 'IN_REVIEW':
      return 'warning';
    case 'DONE':
      return 'success';
    case 'CANCELLED':
      return 'danger';
    default:
      return 'default';
  }
}

export function projectStatusTone(status: ProjectStatus): Tone {
  switch (status) {
    case 'PLANNING':
      return 'muted';
    case 'ACTIVE':
      return 'accent';
    case 'ON_HOLD':
      return 'warning';
    case 'COMPLETED':
      return 'success';
    case 'ARCHIVED':
      return 'default';
    default:
      return 'default';
  }
}

export function priorityTone(priority: Priority): Tone {
  switch (priority) {
    case 'LOW':
      return 'muted';
    case 'MEDIUM':
      return 'default';
    case 'HIGH':
      return 'warning';
    case 'URGENT':
      return 'danger';
    default:
      return 'default';
  }
}

export function StatusBadge({ status }: { status: TaskStatus | ProjectStatus }) {
  const isTask = [
    'TODO',
    'IN_PROGRESS',
    'IN_REVIEW',
    'DONE',
    'CANCELLED',
  ].includes(status);
  const tone = isTask
    ? taskStatusTone(status as TaskStatus)
    : projectStatusTone(status as ProjectStatus);
  return <Badge tone={tone}>{statusLabel(status)}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge tone={priorityTone(priority)}>{priorityLabel(priority)}</Badge>;
}
