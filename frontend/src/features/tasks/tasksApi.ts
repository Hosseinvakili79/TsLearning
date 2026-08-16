import { apiRequest } from '../../shared/api/client';
import type {
  Activity,
  Comment,
  DashboardData,
  Label,
  NotificationItem,
  Priority,
  Task,
  TaskStatus,
} from '../../shared/types';

export function listTasks(token: string, projectId: string) {
  return apiRequest<Task[]>(
    `/projects/${projectId}/tasks`,
    { method: 'GET' },
    token,
  );
}

export function createTask(
  token: string,
  projectId: string,
  payload: {
    title: string;
    description?: string;
    assigneeId?: string;
    status?: TaskStatus;
    priority?: Priority;
    dueDate?: string;
    labelIds?: string[];
  },
) {
  return apiRequest<Task>(
    `/projects/${projectId}/tasks`,
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  );
}

export function getTask(token: string, id: string) {
  return apiRequest<Task>(`/tasks/${id}`, { method: 'GET' }, token);
}

export function updateTask(
  token: string,
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    assigneeId: string | null;
    status: TaskStatus;
    priority: Priority;
    dueDate: string | null;
    labelIds: string[];
  }>,
) {
  return apiRequest<Task>(
    `/tasks/${id}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    token,
  );
}

export function deleteTask(token: string, id: string) {
  return apiRequest<{ success: boolean }>(
    `/tasks/${id}`,
    { method: 'DELETE' },
    token,
  );
}

export function listComments(token: string, taskId: string) {
  return apiRequest<Comment[]>(
    `/tasks/${taskId}/comments`,
    { method: 'GET' },
    token,
  );
}

export function createComment(token: string, taskId: string, content: string) {
  return apiRequest<Comment>(
    `/tasks/${taskId}/comments`,
    { method: 'POST', body: JSON.stringify({ content }) },
    token,
  );
}

export function listLabels(token: string, projectId: string) {
  return apiRequest<Label[]>(
    `/projects/${projectId}/labels`,
    { method: 'GET' },
    token,
  );
}

export function createLabel(
  token: string,
  projectId: string,
  payload: { name: string; color?: string },
) {
  return apiRequest<Label>(
    `/projects/${projectId}/labels`,
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  );
}

export function listActivities(token: string, projectId: string) {
  return apiRequest<Activity[]>(
    `/projects/${projectId}/activities`,
    { method: 'GET' },
    token,
  );
}

export function getDashboard(token: string) {
  return apiRequest<DashboardData>('/dashboard', { method: 'GET' }, token);
}

export function listNotifications(token: string) {
  return apiRequest<NotificationItem[]>(
    '/notifications',
    { method: 'GET' },
    token,
  );
}

export function markNotificationRead(token: string, id: string) {
  return apiRequest<NotificationItem>(
    `/notifications/${id}/read`,
    { method: 'PATCH' },
    token,
  );
}
