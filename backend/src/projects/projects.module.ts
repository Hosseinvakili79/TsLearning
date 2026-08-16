import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CommonModule } from '../common/common.module';
import { TeamRoleGuard } from '../common/guards/team-role.guard';

@Module({
  imports: [CommonModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, TeamRoleGuard],
  exports: [ProjectsService],
})
export class ProjectsModule {}
