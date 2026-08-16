import {
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
import { IsNotEmpty, IsString } from 'class-validator';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class CommentDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}

@Controller()
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('api/v1/tasks/:taskId/comments')
  list(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.commentsService.list(taskId, request.user.sub);
  }

  @Post('api/v1/tasks/:taskId/comments')
  create(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Req() request: { user: { sub: string } },
    @Body() dto: CommentDto,
  ) {
    return this.commentsService.create(taskId, request.user.sub, dto.content);
  }

  @Patch('api/v1/comments/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
    @Body() dto: CommentDto,
  ) {
    return this.commentsService.update(id, request.user.sub, dto.content);
  }

  @Delete('api/v1/comments/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.commentsService.remove(id, request.user.sub);
  }
}
