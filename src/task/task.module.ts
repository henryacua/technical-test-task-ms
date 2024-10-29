import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './services/task.service';
import { UserService } from 'src/user/services/user.service';
import { TaskController } from './controllers/task.controller';
import { Task } from './entities/task.entity';
import { TaskRepository } from './repositories/task.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

const services = [TaskService, UserService];
const repositories = [
  {
    provide: 'TaskRepository',
    useClass: TaskRepository,
  },
  {
    provide: 'UserRepository',
    useClass: UserRepository,
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [...services, ...repositories],
})
export class TaskModule {}
