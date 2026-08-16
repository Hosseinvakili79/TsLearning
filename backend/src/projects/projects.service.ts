import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Priority, ProjectStatus, TeamRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AccessService } from '../common/access.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async create(
    teamId: string,
    userId: string,
    dto: {
      name: string;
      description?: string;
      status?: ProjectStatus;
      priority?: Priority;
      startDate?: string;
      dueDate?: string;
    },
  ) {
    await this.access.requireTeamMember(teamId, userId);

    const project = await this.prisma.project.create({
      data: {
        teamId,
        ownerId: userId,
        name: dto.name,
        description: dto.description,
        status: dto.status ?? ProjectStatus.PLANNING,
        priority: dto.priority ?? Priority.MEDIUM,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        members: {
          create: {
            userId,
            role: TeamRole.OWNER,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    await this.access.logActivity({
      actorId: userId,
      action: 'CREATED_PROJECT',
      entity: 'Project',
      entityId: project.id,
      projectId: project.id,
      metadata: { name: project.name },
    });

    return project;
  }

  async listByTeam(
    teamId: string,
    userId: string,
    filters: { q?: string; status?: ProjectStatus },
  ) {
    await this.access.requireTeamMember(teamId, userId);
    return this.prisma.project.findMany({
      where: {
        teamId,
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.q
          ? { name: { contains: filters.q, mode: 'insensitive' } }
          : {}),
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getById(projectId: string, userId: string) {
    await this.access.requireProjectMember(projectId, userId);
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        labels: true,
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(
    projectId: string,
    userId: string,
    dto: {
      name?: string;
      description?: string;
      status?: ProjectStatus;
      priority?: Priority;
      startDate?: string | null;
      dueDate?: string | null;
    },
  ) {
    await this.access.requireProjectMember(projectId, userId, [
      TeamRole.OWNER,
      TeamRole.ADMIN,
    ]);

    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        startDate:
          dto.startDate === undefined
            ? undefined
            : dto.startDate
              ? new Date(dto.startDate)
              : null,
        dueDate:
          dto.dueDate === undefined
            ? undefined
            : dto.dueDate
              ? new Date(dto.dueDate)
              : null,
      },
    });

    await this.access.logActivity({
      actorId: userId,
      action: 'UPDATED_PROJECT',
      entity: 'Project',
      entityId: projectId,
      projectId,
    });

    return project;
  }

  async remove(projectId: string, userId: string) {
    await this.access.requireProjectMember(projectId, userId, [TeamRole.OWNER]);
    await this.prisma.project.delete({ where: { id: projectId } });
    return { success: true };
  }

  async addMember(
    projectId: string,
    actorId: string,
    userId: string,
    role: TeamRole,
  ) {
    const membership = await this.access.requireProjectMember(projectId, actorId, [
      TeamRole.OWNER,
      TeamRole.ADMIN,
    ]);

    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: membership.project.teamId,
          userId,
        },
      },
    });
    if (!teamMember) {
      throw new BadRequestException('User must be a team member first');
    }
    if (role === TeamRole.OWNER) {
      throw new BadRequestException('Cannot assign owner via this endpoint');
    }

    const member = await this.prisma.projectMember.create({
      data: { projectId, userId, role },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await this.access.notify({
      userId,
      type: 'PROJECT_INVITATION',
      title: 'عضویت در پروژه',
      body: 'به یک پروژه اضافه شدید',
    });

    return member;
  }

  async updateMemberRole(
    projectId: string,
    actorId: string,
    userId: string,
    role: TeamRole,
  ) {
    await this.access.requireProjectMember(projectId, actorId, [
      TeamRole.OWNER,
      TeamRole.ADMIN,
    ]);
    const target = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!target) {
      throw new NotFoundException('Project member not found');
    }
    if (target.role === TeamRole.OWNER) {
      throw new ForbiddenException('Cannot change project owner role');
    }
    if (role === TeamRole.OWNER) {
      throw new BadRequestException('Cannot promote to owner here');
    }
    return this.prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId } },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async removeMember(projectId: string, actorId: string, userId: string) {
    await this.access.requireProjectMember(projectId, actorId, [
      TeamRole.OWNER,
      TeamRole.ADMIN,
    ]);
    const target = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!target) {
      throw new NotFoundException('Project member not found');
    }
    if (target.role === TeamRole.OWNER) {
      throw new ForbiddenException('Cannot remove project owner');
    }
    await this.prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId } },
    });
    return { success: true };
  }
}
