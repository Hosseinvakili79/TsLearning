import { Injectable } from '@nestjs/common';
import { TeamRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  createTeam(ownerId: string, name: string, description?: string) {
    return this.prisma.team.create({
      data: {
        name,
        description,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: TeamRole.OWNER,
          },
        },
      },
      include: {
        members: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });
  }

  listUserTeams(userId: string) {
    return this.prisma.team.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  getTeamById(id: string) {
    return this.prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            userId: true,
            role: true,
            joinedAt: true,
          },
        },
      },
    });
  }
}
