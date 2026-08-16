import { apiRequest } from '../../shared/api/client';
import type { Invitation, Team, TeamMember, TeamRole } from '../../shared/types';

export function listTeams(token: string) {
  return apiRequest<Team[]>('/teams', { method: 'GET' }, token);
}

export function createTeam(
  token: string,
  payload: { name: string; description?: string },
) {
  return apiRequest<Team>(
    '/teams',
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  );
}

export function getTeam(token: string, id: string) {
  return apiRequest<Team & { projects?: unknown[] }>(
    `/teams/${id}`,
    { method: 'GET' },
    token,
  );
}

export function updateTeam(
  token: string,
  id: string,
  payload: { name?: string; description?: string },
) {
  return apiRequest<Team>(
    `/teams/${id}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    token,
  );
}

export function deleteTeam(token: string, id: string) {
  return apiRequest<{ success: boolean }>(
    `/teams/${id}`,
    { method: 'DELETE' },
    token,
  );
}

export function listMembers(token: string, teamId: string) {
  return apiRequest<TeamMember[]>(
    `/teams/${teamId}/members`,
    { method: 'GET' },
    token,
  );
}

export function updateMemberRole(
  token: string,
  teamId: string,
  userId: string,
  role: TeamRole,
) {
  return apiRequest<TeamMember>(
    `/teams/${teamId}/members/${userId}`,
    { method: 'PATCH', body: JSON.stringify({ role }) },
    token,
  );
}

export function removeMember(token: string, teamId: string, userId: string) {
  return apiRequest<{ success: boolean }>(
    `/teams/${teamId}/members/${userId}`,
    { method: 'DELETE' },
    token,
  );
}

export function inviteMember(
  token: string,
  teamId: string,
  payload: { email: string; role?: TeamRole },
) {
  return apiRequest<Invitation>(
    `/teams/${teamId}/invitations`,
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  );
}

export function listInvitations(token: string) {
  return apiRequest<Invitation[]>('/invitations', { method: 'GET' }, token);
}

export function acceptInvitation(token: string, inviteToken: string) {
  return apiRequest<{ success: boolean; teamId: string }>(
    `/invitations/${inviteToken}/accept`,
    { method: 'POST' },
    token,
  );
}

export function rejectInvitation(token: string, inviteToken: string) {
  return apiRequest<{ success: boolean }>(
    `/invitations/${inviteToken}/reject`,
    { method: 'POST' },
    token,
  );
}
