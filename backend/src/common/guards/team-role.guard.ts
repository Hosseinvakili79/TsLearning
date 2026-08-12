import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { TEAM_ROLES_KEY } from '../decorators/team-roles.decorator';
import { TeamRole } from '../enums/team-role.enum';

@Injectable()
export class TeamRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<TeamRole[]>(
      TEAM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: { sub: string };
      params: { teamId?: string; id?: string };
    }>();
    const userId = request.user?.sub;
    const teamId = request.params.teamId ?? request.params.id;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!teamId) {
      throw new ForbiddenException('Team context is required for this action');
    }

    const membership = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      select: { role: true },
    });

    if (!membership || !requiredRoles.includes(membership.role as TeamRole)) {
      throw new ForbiddenException('Insufficient team role permissions');
    }

    return true;
  }
}
