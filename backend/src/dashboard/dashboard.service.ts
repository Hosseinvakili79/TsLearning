import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [projects, assignedTasks, recentActivity] = await Promise.all([
      this.prisma.project.findMany({
        where: { members: { some: { userId } } },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.task.findMany({
        where: { assigneeId: userId },
        include: {
          assignee: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          labels: { include: { label: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.activity.findMany({
        where: {
          OR: [
            { actorId: userId },
            { project: { members: { some: { userId } } } },
          ],
        },
        include: {
          actor: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const tasksByStatus: Record<string, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      DONE: 0,
      CANCELLED: 0,
    };

    for (const task of assignedTasks) {
      tasksByStatus[task.status] = (tasksByStatus[task.status] ?? 0) + 1;
    }

    const overdueCount = assignedTasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate < startOfDay &&
        task.status !== TaskStatus.DONE &&
        task.status !== TaskStatus.CANCELLED,
    ).length;

    const dueTodayCount = assignedTasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate >= startOfDay &&
        task.dueDate <= endOfDay &&
        task.status !== TaskStatus.DONE &&
        task.status !== TaskStatus.CANCELLED,
    ).length;

    return {
      projectsCount: projects.length,
      tasksByStatus,
      overdueCount,
      dueTodayCount,
      recentProjects: projects.slice(0, 8),
      recentActivity,
      assignedTasks: assignedTasks.slice(0, 20).map((task) => ({
        ...task,
        labels: task.labels.map((item) => item.label),
      })),
    };
  }
}
