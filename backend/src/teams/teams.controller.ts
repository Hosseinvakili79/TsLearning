import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamRoles } from '../common/decorators/team-roles.decorator';
import { TeamRole } from '../common/enums/team-role.enum';
import { TeamRoleGuard } from '../common/guards/team-role.guard';

class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
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
  @TeamRoles(TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER)
  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.teamsService.getTeamById(id);
  }
}
