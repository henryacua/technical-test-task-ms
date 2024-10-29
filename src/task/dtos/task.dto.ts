import { IsEnum, IsNumber, IsOptional, Length } from 'class-validator';
import { TaskStatus } from 'src/common/enums';

export class CreateTaskDto {
  @Length(3)
  title: string;
  @Length(10)
  description: string;
  @IsNumber()
  assignedUser: number;
}

export class UpdateTaskDto {
  @IsOptional()
  @Length(3)
  title?: string;

  @IsOptional()
  @Length(10)
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsNumber()
  assignedUser?: number;
}
