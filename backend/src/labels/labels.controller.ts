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
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LabelsService } from './labels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class LabelDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  color?: string;
}

@Controller()
@UseGuards(JwtAuthGuard)
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get('api/v1/projects/:projectId/labels')
  list(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.labelsService.list(projectId, request.user.sub);
  }

  @Post('api/v1/projects/:projectId/labels')
  create(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Req() request: { user: { sub: string } },
    @Body() dto: LabelDto,
  ) {
    return this.labelsService.create(projectId, request.user.sub, dto);
  }

  @Patch('api/v1/labels/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
    @Body() dto: LabelDto,
  ) {
    return this.labelsService.update(id, request.user.sub, dto);
  }

  @Delete('api/v1/labels/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.labelsService.remove(id, request.user.sub);
  }
}
