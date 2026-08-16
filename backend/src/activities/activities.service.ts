import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccessService } from '../common/access.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async listByProject(projectId: string, userId: string) {
    await this.access.requireProjectMember(projectId, userId);
    return this.prisma.activity.findMany({
      where: { projectId },
      include: {
        actor: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
