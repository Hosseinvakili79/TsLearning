import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AccessService } from '../common/access.service';

@Injectable()
export class LabelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async list(projectId: string, userId: string) {
    await this.access.requireProjectMember(projectId, userId);
    return this.prisma.label.findMany({
      where: { projectId },
      orderBy: { name: 'asc' },
    });
  }

  async create(
    projectId: string,
    userId: string,
    dto: { name: string; color?: string },
  ) {
    await this.access.requireProjectMember(projectId, userId, [
      TeamRole.OWNER,
      TeamRole.ADMIN,
      TeamRole.MEMBER,
    ]);
    return this.prisma.label.create({
      data: { projectId, name: dto.name, color: dto.color },
    });
  }

  async update(
    labelId: string,
    userId: string,
    dto: { name: string; color?: string },
  ) {
    const label = await this.prisma.label.findUnique({ where: { id: labelId } });
    if (!label) {
      throw new NotFoundException('Label not found');
    }
    await this.access.requireProjectMember(label.projectId, userId);
    return this.prisma.label.update({
      where: { id: labelId },
      data: { name: dto.name, color: dto.color },
    });
  }

  async remove(labelId: string, userId: string) {
    const label = await this.prisma.label.findUnique({ where: { id: labelId } });
    if (!label) {
      throw new NotFoundException('Label not found');
    }
    await this.access.requireProjectMember(label.projectId, userId, [
      TeamRole.OWNER,
      TeamRole.ADMIN,
    ]);
    await this.prisma.label.delete({ where: { id: labelId } });
    return { success: true };
  }
}
