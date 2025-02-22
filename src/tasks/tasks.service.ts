import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllTasks({ completed, search = '', page, limit }) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (completed) {
      where.completed = completed;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { descriptions: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tasks = await this.prisma.task.findMany({
      where,
      skip,
      take: Number(limit),
    });

    const total = await this.prisma.task.count({ where });

    return {
      data: tasks,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  async createTask(data: CreateTaskDto) {
    return this.prisma.task.create({
      data,
    });
  }

  async updateTask(id: string, data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async deleteTask(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
