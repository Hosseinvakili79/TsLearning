import { apiRequest } from '../../shared/api/client';
import type {
  Priority,
  Project,
  ProjectMember,
  ProjectStatus,
  TeamRole,
} from '../../shared/types';

export function listProjects(
  token: string,
  teamId: string,
  params?: { q?: string; status?: ProjectStatus },
) {
  const search = new URLSearchParams();
  if (params?.q) search.set('q', params.q);
  if (params?.status) search.set('status', params.status);
  const qs = search.toString();
  return apiRequest<Project[]>(
    `/teams/${teamId}/projects${qs ? `?${qs}` : ''}`,
    { method: 'GET' },
    token,
  );
}

export function createProject(
  token: string,
  teamId: string,
  payload: {
    name: string;
    description?: string;
    status?: ProjectStatus;
    priority?: Priority;
    dueDate?: string;
  },
) {
  return apiRequest<Project>(
    `/teams/${teamId}/projects`,
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  );
}

export function getProject(token: string, id: string) {
  return apiRequest<Project>(`/projects/${id}`, { method: 'GET' }, token);
}

export function updateProject(
  token: string,
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    status: ProjectStatus;
    priority: Priority;
    dueDate: string | null;
  }>,
) {
  return apiRequest<Project>(
    `/projects/${id}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    token,
  );
}

export function deleteProject(token: string, id: string) {
  return apiRequest<{ success: boolean }>(
    `/projects/${id}`,
    { method: 'DELETE' },
    token,
  );
}

export function addProjectMember(
  token: string,
  projectId: string,
  payload: { userId: string; role?: TeamRole },
) {
  return apiRequest<ProjectMember>(
    `/projects/${projectId}/members`,
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  );
}

export function removeProjectMember(
  token: string,
  projectId: string,
  userId: string,
) {
  return apiRequest<{ success: boolean }>(
    `/projects/${projectId}/members/${userId}`,
    { method: 'DELETE' },
    token,
  );
}
