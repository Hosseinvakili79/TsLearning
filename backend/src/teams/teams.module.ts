import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CommonModule } from '../common/common.module';
import { TeamRoleGuard } from '../common/guards/team-role.guard';

@Module({
  imports: [CommonModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamRoleGuard],
  exports: [TeamsService],
})
export class TeamsModule {}
