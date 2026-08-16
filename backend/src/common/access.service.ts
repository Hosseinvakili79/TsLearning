import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TeamRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async requireTeamMember(teamId: string, userId: string, roles?: TeamRole[]) {
    const membership = await this.prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('Team membership required');
    }
    if (roles && !roles.includes(membership.role)) {
      throw new ForbiddenException('Insufficient team role permissions');
    }
    return membership;
  }

  async requireProjectMember(
    projectId: string,
    userId: string,
    roles?: TeamRole[],
  ) {
    const membership = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      include: { project: true },
    });
    if (!membership) {
      throw new ForbiddenException('Project membership required');
    }
    if (roles && !roles.includes(membership.role)) {
      throw new ForbiddenException('Insufficient project role permissions');
    }
    return membership;
  }

  async getProjectOrThrow(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async logActivity(input: {
    actorId: string;
    action: string;
    entity: string;
    entityId: string;
    projectId?: string | null;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.activity.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        projectId: input.projectId ?? null,
        metadata: input.metadata,
      },
    });
  }

  async notify(input: {
    userId: string;
    type: string;
    title: string;
    body?: string;
  }) {
    return this.prisma.notification.create({ data: input });
  }
}
