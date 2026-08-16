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
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Priority, TaskStatus } from '@prisma/client';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsISO8601()
  @IsOptional()
  dueDate?: string;

  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  labelIds?: string[];
}

class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string | null;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsISO8601()
  @IsOptional()
  dueDate?: string | null;

  @IsISO8601()
  @IsOptional()
  startDate?: string | null;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  labelIds?: string[];
}

@Controller()
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('api/v1/projects/:projectId/tasks')
  create(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Req() request: { user: { sub: string } },
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(projectId, request.user.sub, dto);
  }

  @Get('api/v1/projects/:projectId/tasks')
  list(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.tasksService.list(projectId, request.user.sub);
  }

  @Get('api/v1/tasks/:id')
  getById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.tasksService.getById(id, request.user.sub);
  }

  @Patch('api/v1/tasks/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, request.user.sub, dto);
  }

  @Delete('api/v1/tasks/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.tasksService.remove(id, request.user.sub);
  }
}
