import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { TaskService } from '../services/task.service';
import { PAGINATION } from 'src/common/constants';
import { PaginationResult } from 'src/common/interfaces';
import { Task } from '../entities/task.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAllTasks(
    @Query('page') page: number = PAGINATION.DEFAULT_PAGE,
    @Query('limit') limit: number = PAGINATION.DEFAULT_LIMIT,
  ): Promise<PaginationResult<Task>> {
    return this.taskService.getAllTasks(page, limit);
  }

  @Get(':taskId')
  getTaskById(@Param('taskId') taskId: number): Promise<Task> {
    return this.taskService.getTaskById(taskId);
  }

  @Get('user/:assignedUser')
  getTaskByUserId(
    @Param('assignedUser') userId: number,
    @Query('page') page: number = PAGINATION.DEFAULT_PAGE,
    @Query('limit') limit: number = PAGINATION.DEFAULT_LIMIT,
  ): Promise<PaginationResult<Task>> {
    return this.taskService.getTaskByUserId(userId, page, limit);
  }

  @Post()
  createTask(@Body() taskData: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(taskData);
  }

  @Patch(':taskId')
  updateTask(
    @Param('taskId') taskId: number,
    @Body() updateTaskData: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(taskId, updateTaskData);
  }

  @Delete(':taskId')
  deleteTask(@Param('taskId') taskId: number): Promise<boolean> {
    return this.taskService.deleteTask(taskId);
  }
}
