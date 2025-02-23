import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Get()
  getAllTasks(
    @Query('completed') completed?: boolean,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.tasksService.getAllTasks({ completed, search, page, limit });
  }

  @Post()
  createTask(@Body() data: CreateTaskDto) {
    return this.tasksService.createTask(data);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    return this.tasksService.updateTask(id, data);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
