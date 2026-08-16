export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export type InvitationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type ProjectStatus =
  | 'PLANNING'
  | 'ACTIVE'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'ARCHIVED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'DONE'
  | 'CANCELLED';

export interface Team {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members?: TeamMember[];
}

export interface TeamMember {
  id?: string;
  userId: string;
  role: TeamRole;
  joinedAt?: string;
  user?: { id: string; email: string; firstName: string; lastName: string };
}

export interface Invitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  status: InvitationStatus;
  token: string;
  expiresAt: string;
  createdAt: string;
  team?: { id: string; name: string };
}

export interface Project {
  id: string;
  teamId: string;
  ownerId: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  priority: Priority;
  startDate?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  members?: ProjectMember[];
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: TeamRole;
  user?: { id: string; email: string; firstName: string; lastName: string };
}

export interface Label {
  id: string;
  projectId: string;
  name: string;
  color?: string | null;
}

export interface Task {
  id: string;
  projectId: string;
  creatorId: string;
  assigneeId?: string | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  startDate?: string | null;
  createdAt: string;
  updatedAt: string;
  assignee?: { id: string; email: string; firstName: string; lastName: string } | null;
  labels?: Label[];
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; email: string; firstName: string; lastName: string };
}

export interface Activity {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  projectId?: string | null;
  metadata?: unknown;
  createdAt: string;
  actor?: { id: string; firstName: string; lastName: string; email: string };
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  body?: string | null;
  readAt?: string | null;
  createdAt: string;
}

export interface DashboardData {
  projectsCount: number;
  tasksByStatus: Record<string, number>;
  overdueCount: number;
  dueTodayCount: number;
  recentProjects: Project[];
  recentActivity: Activity[];
  assignedTasks: Task[];
}
