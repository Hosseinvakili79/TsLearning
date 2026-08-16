import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@Req() request: { user: { sub: string } }) {
    return this.notificationsService.list(request.user.sub);
  }

  @Patch(':id/read')
  markRead(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.notificationsService.markRead(id, request.user.sub);
  }
}
