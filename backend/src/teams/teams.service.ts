import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvitationStatus, TeamRole } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AccessService } from '../common/access.service';

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

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
  }

  listUserTeams(userId: string) {
    return this.prisma.team.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTeamById(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
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
        projects: {
          orderBy: { updatedAt: 'desc' },
        },
      },
    });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  updateTeam(id: string, data: { name?: string; description?: string }) {
    return this.prisma.team.update({ where: { id }, data });
  }

  async deleteTeam(id: string) {
    await this.prisma.team.delete({ where: { id } });
    return { success: true };
  }

  listMembers(teamId: string) {
    return this.prisma.teamMember.findMany({
      where: { teamId },
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
      orderBy: { joinedAt: 'asc' },
    });
  }

  async updateMemberRole(
    teamId: string,
    userId: string,
    role: TeamRole,
    actorId: string,
  ) {
    const target = await this.prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!target) {
      throw new NotFoundException('Member not found');
    }
    if (target.role === TeamRole.OWNER) {
      throw new ForbiddenException('Cannot change owner role');
    }
    if (role === TeamRole.OWNER) {
      throw new BadRequestException('Use ownership transfer instead');
    }
    if (userId === actorId && role !== TeamRole.ADMIN) {
      // allowed
    }
    return this.prisma.teamMember.update({
      where: { teamId_userId: { teamId, userId } },
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

  async removeMember(teamId: string, userId: string, actorId: string) {
    const target = await this.prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!target) {
      throw new NotFoundException('Member not found');
    }
    if (target.role === TeamRole.OWNER) {
      throw new ForbiddenException('Cannot remove team owner');
    }
    if (userId === actorId) {
      throw new BadRequestException('Use leave flow separately');
    }
    await this.prisma.teamMember.delete({
      where: { teamId_userId: { teamId, userId } },
    });
    return { success: true };
  }

  async createInvitation(
    teamId: string,
    invitedBy: string,
    email: string,
    role: TeamRole,
  ) {
    if (role === TeamRole.OWNER) {
      throw new BadRequestException('Cannot invite as owner');
    }

    const normalizedEmail = email.toLowerCase();
    const existingMember = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        user: { email: normalizedEmail },
      },
    });
    if (existingMember) {
      throw new BadRequestException('User is already a team member');
    }

    const activeInvite = await this.prisma.invitation.findFirst({
      where: {
        teamId,
        email: normalizedEmail,
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });
    if (activeInvite) {
      throw new BadRequestException('Active invitation already exists');
    }

    const invitation = await this.prisma.invitation.create({
      data: {
        teamId,
        email: normalizedEmail,
        role,
        invitedBy,
        token: randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: {
        team: { select: { id: true, name: true } },
      },
    });

    const invitee = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (invitee) {
      await this.access.notify({
        userId: invitee.id,
        type: 'TEAM_INVITATION',
        title: 'دعوت به تیم',
        body: `به تیم ${invitation.team.name} دعوت شده‌اید`,
      });
    }

    return invitation;
  }
}
