import { Injectable, NotFoundException } from '@nestjs/common';
import { Priority, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AccessService } from '../common/access.service';

const taskInclude = {
  assignee: {
    select: { id: true, email: true, firstName: true, lastName: true },
  },
  labels: { include: { label: true } },
} as const;

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  private mapTask<T extends { labels: Array<{ label: unknown }> }>(task: T) {
    return {
      ...task,
      labels: task.labels.map((item) => item.label),
    };
  }

  async create(
    projectId: string,
    userId: string,
    dto: {
      title: string;
      description?: string;
      assigneeId?: string;
      status?: TaskStatus;
      priority?: Priority;
      dueDate?: string;
      startDate?: string;
      labelIds?: string[];
    },
  ) {
    await this.access.requireProjectMember(projectId, userId);

    if (dto.assigneeId) {
      await this.access.requireProjectMember(projectId, dto.assigneeId);
    }

    const task = await this.prisma.task.create({
      data: {
        projectId,
        creatorId: userId,
        title: dto.title,
        description: dto.description,
        assigneeId: dto.assigneeId,
        status: dto.status ?? TaskStatus.TODO,
        priority: dto.priority ?? Priority.MEDIUM,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        labels: dto.labelIds?.length
          ? {
              create: dto.labelIds.map((labelId) => ({ labelId })),
            }
          : undefined,
      },
      include: taskInclude,
    });

    await this.access.logActivity({
      actorId: userId,
      action: 'CREATED_TASK',
      entity: 'Task',
      entityId: task.id,
      projectId,
      metadata: { title: task.title },
    });

    if (dto.assigneeId && dto.assigneeId !== userId) {
      await this.access.notify({
        userId: dto.assigneeId,
        type: 'TASK_ASSIGNMENT',
        title: 'تخصیص وظیفه',
        body: task.title,
      });
    }

    return this.mapTask(task);
  }

  async list(projectId: string, userId: string) {
    await this.access.requireProjectMember(projectId, userId);
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: taskInclude,
      orderBy: { updatedAt: 'desc' },
    });
    return tasks.map((task) => this.mapTask(task));
  }

  async getById(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: taskInclude,
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.access.requireProjectMember(task.projectId, userId);
    return this.mapTask(task);
  }

  async update(
    taskId: string,
    userId: string,
    dto: {
      title?: string;
      description?: string;
      assigneeId?: string | null;
      status?: TaskStatus;
      priority?: Priority;
      dueDate?: string | null;
      startDate?: string | null;
      labelIds?: string[];
    },
  ) {
    const existing = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!existing) {
      throw new NotFoundException('Task not found');
    }
    await this.access.requireProjectMember(existing.projectId, userId);

    if (dto.assigneeId) {
      await this.access.requireProjectMember(existing.projectId, dto.assigneeId);
    }

    if (dto.labelIds) {
      await this.prisma.taskLabel.deleteMany({ where: { taskId } });
      if (dto.labelIds.length) {
        await this.prisma.taskLabel.createMany({
          data: dto.labelIds.map((labelId) => ({ taskId, labelId })),
        });
      }
    }

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: dto.title,
        description: dto.description,
        assigneeId: dto.assigneeId,
        status: dto.status,
        priority: dto.priority,
        dueDate:
          dto.dueDate === undefined
            ? undefined
            : dto.dueDate
              ? new Date(dto.dueDate)
              : null,
        startDate:
          dto.startDate === undefined
            ? undefined
            : dto.startDate
              ? new Date(dto.startDate)
              : null,
      },
      include: taskInclude,
    });

    if (dto.status && dto.status !== existing.status) {
      await this.access.logActivity({
        actorId: userId,
        action: 'CHANGED_TASK_STATUS',
        entity: 'Task',
        entityId: taskId,
        projectId: existing.projectId,
        metadata: { from: existing.status, to: dto.status },
      });
      if (existing.assigneeId && existing.assigneeId !== userId) {
        await this.access.notify({
          userId: existing.assigneeId,
          type: 'TASK_STATUS_CHANGE',
          title: 'تغییر وضعیت وظیفه',
          body: task.title,
        });
      }
    }

    if (
      dto.assigneeId &&
      dto.assigneeId !== existing.assigneeId &&
      dto.assigneeId !== userId
    ) {
      await this.access.notify({
        userId: dto.assigneeId,
        type: 'TASK_ASSIGNMENT',
        title: 'تخصیص وظیفه',
        body: task.title,
      });
      await this.access.logActivity({
        actorId: userId,
        action: 'ASSIGNED_TASK',
        entity: 'Task',
        entityId: taskId,
        projectId: existing.projectId,
        metadata: { assigneeId: dto.assigneeId },
      });
    }

    return this.mapTask(task);
  }

  async remove(taskId: string, userId: string) {
    const existing = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!existing) {
      throw new NotFoundException('Task not found');
    }
    await this.access.requireProjectMember(existing.projectId, userId);
    await this.prisma.task.delete({ where: { id: taskId } });
    return { success: true };
  }
}
