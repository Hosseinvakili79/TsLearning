import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TeamRoleGuard } from '../common/guards/team-role.guard';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, TeamRoleGuard],
})
export class TeamsModule {}
