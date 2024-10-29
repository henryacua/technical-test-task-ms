import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Task } from '../entities/task.entity';
import { PaginationResult } from 'src/common/interfaces';

export class TaskRepository {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async getAllTasks(
    page: number,
    limit: number,
  ): Promise<PaginationResult<Task>> {
    const [data, total] = await this.entityManager
      .getRepository(Task)
      .createQueryBuilder()
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async getTaskById(taskId: number): Promise<Task> {
    return this.entityManager
      .getRepository(Task)
      .createQueryBuilder()
      .where('id = :taskId', { taskId })
      .getOne();
  }

  async getTaskByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<PaginationResult<Task>> {
    const [data, total] = await this.entityManager
      .getRepository(Task)
      .createQueryBuilder('task')
      .where('task.assignedUser = :userId', { userId })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    return this.entityManager.getRepository(Task).save(taskData);
  }

  async updateTask(taskId: number, task: Partial<Task>): Promise<Task> {
    await this.entityManager
      .getRepository(Task)
      .createQueryBuilder()
      .update()
      .set(task)
      .where('id = :taskId', { taskId })
      .execute();

    return this.entityManager
      .getRepository(Task)
      .createQueryBuilder('task')
      .where('task.id = :taskId', { taskId })
      .getOne();
  }

  async deleteTask(taskId: number): Promise<boolean> {
    const result = await this.entityManager
      .getRepository(Task)
      .createQueryBuilder()
      .delete()
      .where('id = :taskId', { taskId })
      .execute();

    return result.affected > 0;
  }
}
