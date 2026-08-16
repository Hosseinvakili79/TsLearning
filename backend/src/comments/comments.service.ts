import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccessService } from '../common/access.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async list(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.access.requireProjectMember(task.projectId, userId);
    return this.prisma.comment.findMany({
      where: { taskId },
      include: {
        author: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(taskId: string, userId: string, content: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.access.requireProjectMember(task.projectId, userId);

    const comment = await this.prisma.comment.create({
      data: { taskId, authorId: userId, content },
      include: {
        author: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    await this.access.logActivity({
      actorId: userId,
      action: 'ADDED_COMMENT',
      entity: 'Comment',
      entityId: comment.id,
      projectId: task.projectId,
      metadata: { taskId },
    });

    return comment;
  }

  async update(commentId: string, userId: string, content: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { task: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.access.requireProjectMember(comment.task.projectId, userId);
    if (comment.authorId !== userId) {
      throw new ForbiddenException('Can only edit own comments');
    }
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async remove(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { task: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.access.requireProjectMember(comment.task.projectId, userId);
    if (comment.authorId !== userId) {
      throw new ForbiddenException('Can only delete own comments');
    }
    await this.prisma.comment.delete({ where: { id: commentId } });
    return { success: true };
  }
}
