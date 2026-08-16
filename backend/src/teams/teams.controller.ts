import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TeamRole } from '@prisma/client';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamRoles } from '../common/decorators/team-roles.decorator';
import { TeamRole as TeamRoleEnum } from '../common/enums/team-role.enum';
import { TeamRoleGuard } from '../common/guards/team-role.guard';

class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

class UpdateTeamDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

class UpdateMemberRoleDto {
  @IsEnum(TeamRole)
  role!: TeamRole;
}

class CreateInvitationDto {
  @IsEmail()
  email!: string;

  @IsEnum(TeamRole)
  @IsOptional()
  role?: TeamRole;
}

@UseGuards(JwtAuthGuard)
@Controller('api/v1/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(
    @Req() request: { user: { sub: string } },
    @Body() dto: CreateTeamDto,
  ) {
    return this.teamsService.createTeam(
      request.user.sub,
      dto.name,
      dto.description,
    );
  }

  @Get()
  list(@Req() request: { user: { sub: string } }) {
    return this.teamsService.listUserTeams(request.user.sub);
  }

  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleEnum.OWNER, TeamRoleEnum.ADMIN, TeamRoleEnum.MEMBER)
  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.teamsService.getTeamById(id);
  }

  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleEnum.OWNER, TeamRoleEnum.ADMIN)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTeamDto,
  ) {
    if (!dto.name && dto.description === undefined) {
      throw new BadRequestException('Nothing to update');
    }
    return this.teamsService.updateTeam(id, dto);
  }

  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleEnum.OWNER)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.teamsService.deleteTeam(id);
  }

  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleEnum.OWNER, TeamRoleEnum.ADMIN, TeamRoleEnum.MEMBER)
  @Get(':id/members')
  listMembers(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.teamsService.listMembers(id);
  }

  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleEnum.OWNER, TeamRoleEnum.ADMIN)
  @Patch(':id/members/:userId')
  updateMember(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: UpdateMemberRoleDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.teamsService.updateMemberRole(
      id,
      userId,
      dto.role,
      request.user.sub,
    );
  }

  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleEnum.OWNER, TeamRoleEnum.ADMIN)
  @Delete(':id/members/:userId')
  removeMember(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.teamsService.removeMember(id, userId, request.user.sub);
  }

  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleEnum.OWNER, TeamRoleEnum.ADMIN)
  @Post(':id/invitations')
  invite(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateInvitationDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.teamsService.createInvitation(
      id,
      request.user.sub,
      dto.email,
      dto.role ?? TeamRole.MEMBER,
    );
  }
}
