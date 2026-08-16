import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Priority, ProjectStatus, TeamRole } from '@prisma/client';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamRoles } from '../common/decorators/team-roles.decorator';
import { TeamRole as TeamRoleEnum } from '../common/enums/team-role.enum';
import { TeamRoleGuard } from '../common/guards/team-role.guard';

class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @IsISO8601()
  @IsOptional()
  dueDate?: string;
}

class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsISO8601()
  @IsOptional()
  startDate?: string | null;

  @IsISO8601()
  @IsOptional()
  dueDate?: string | null;
}

class AddProjectMemberDto {
  @IsUUID()
  userId!: string;

  @IsEnum(TeamRole)
  @IsOptional()
  role?: TeamRole;
}

class UpdateProjectMemberDto {
  @IsEnum(TeamRole)
  role!: TeamRole;
}

@Controller()
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleEnum.OWNER, TeamRoleEnum.ADMIN, TeamRoleEnum.MEMBER)
  @Post('api/v1/teams/:teamId/projects')
  create(
    @Param('teamId', new ParseUUIDPipe()) teamId: string,
    @Req() request: { user: { sub: string } },
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(teamId, request.user.sub, dto);
  }

  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleEnum.OWNER, TeamRoleEnum.ADMIN, TeamRoleEnum.MEMBER)
  @Get('api/v1/teams/:teamId/projects')
  listByTeam(
    @Param('teamId', new ParseUUIDPipe()) teamId: string,
    @Req() request: { user: { sub: string } },
    @Query('q') q?: string,
    @Query('status') status?: ProjectStatus,
  ) {
    return this.projectsService.listByTeam(teamId, request.user.sub, {
      q,
      status,
    });
  }

  @Get('api/v1/projects/:id')
  getById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.projectsService.getById(id, request.user.sub);
  }

  @Patch('api/v1/projects/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, request.user.sub, dto);
  }

  @Delete('api/v1/projects/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.projectsService.remove(id, request.user.sub);
  }

  @Post('api/v1/projects/:id/members')
  addMember(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
    @Body() dto: AddProjectMemberDto,
  ) {
    return this.projectsService.addMember(
      id,
      request.user.sub,
      dto.userId,
      dto.role ?? TeamRole.MEMBER,
    );
  }

  @Patch('api/v1/projects/:id/members/:userId')
  updateMember(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Req() request: { user: { sub: string } },
    @Body() dto: UpdateProjectMemberDto,
  ) {
    return this.projectsService.updateMemberRole(
      id,
      request.user.sub,
      userId,
      dto.role,
    );
  }

  @Delete('api/v1/projects/:id/members/:userId')
  removeMember(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.projectsService.removeMember(id, request.user.sub, userId);
  }
}
