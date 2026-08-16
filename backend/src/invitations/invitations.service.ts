import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvitationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AccessService } from '../common/access.service';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async listForUser(userId: string, email: string) {
    return this.prisma.invitation.findMany({
      where: {
        email: email.toLowerCase(),
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
      include: {
        team: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async accept(token: string, userId: string, email: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: { team: true },
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      throw new ForbiddenException('Invitation email mismatch');
    }
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Invitation is not pending');
    }
    if (invitation.expiresAt < new Date()) {
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });
      throw new BadRequestException('Invitation expired');
    }

    await this.prisma.$transaction([
      this.prisma.teamMember.upsert({
        where: {
          teamId_userId: { teamId: invitation.teamId, userId },
        },
        create: {
          teamId: invitation.teamId,
          userId,
          role: invitation.role,
        },
        update: {},
      }),
      this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.ACCEPTED },
      }),
    ]);

    await this.access.logActivity({
      actorId: userId,
      action: 'JOINED_TEAM',
      entity: 'Team',
      entityId: invitation.teamId,
      metadata: { invitationId: invitation.id },
    });

    return { success: true, teamId: invitation.teamId };
  }

  async reject(token: string, userId: string, email: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      throw new ForbiddenException('Invitation email mismatch');
    }
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Invitation is not pending');
    }

    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.REJECTED },
    });

    return { success: true };
  }
}
