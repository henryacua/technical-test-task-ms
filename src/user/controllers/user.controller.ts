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
import { CreateUserDto, UpdateUserDto, UserLoginDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { PAGINATION } from 'src/common/constants';
import { UserService } from '../services/user.service';
import { PaginationResult } from 'src/common/interfaces';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(
    @Query('page') page: number = PAGINATION.DEFAULT_PAGE,
    @Query('limit') limit: number = PAGINATION.DEFAULT_LIMIT,
  ): Promise<PaginationResult<User>> {
    return this.userService.getAllUsers(page, limit);
  }

  @Get(':userId')
  getUserById(@Param('userId') userId: number): Promise<User> {
    return this.userService.getUserById(userId);
  }

  @Post()
  createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Patch(':userId')
  updateUser(
    @Param('userId') userId: number,
    @Body() updateUserData: UpdateUserDto,
  ): Promise<Partial<User>> {
    return this.userService.updateUser(userId, updateUserData);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: number): Promise<boolean> {
    return this.userService.deleteUser(userId);
  }

  @Post('login')
  login(
    @Body() userData: UserLoginDto,
  ): Promise<{ token: string; userId: number }> {
    return this.userService.login(userData);
  }
}
