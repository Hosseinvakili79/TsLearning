import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get()
  list(@Req() request: { user: { sub: string; email: string } }) {
    return this.invitationsService.listForUser(
      request.user.sub,
      request.user.email,
    );
  }

  @Post(':token/accept')
  accept(
    @Param('token') token: string,
    @Req() request: { user: { sub: string; email: string } },
  ) {
    if (!token) {
      throw new BadRequestException('Token required');
    }
    return this.invitationsService.accept(
      token,
      request.user.sub,
      request.user.email,
    );
  }

  @Post(':token/reject')
  reject(
    @Param('token') token: string,
    @Req() request: { user: { sub: string; email: string } },
  ) {
    return this.invitationsService.reject(
      token,
      request.user.sub,
      request.user.email,
    );
  }
}
