import { Controller, Get, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivitiesService } from './activities.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('api/v1/projects/:projectId/activities')
  list(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.activitiesService.listByProject(projectId, request.user.sub);
  }
}
