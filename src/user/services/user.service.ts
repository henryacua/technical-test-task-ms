import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/user.repository';
import { PaginationResult } from 'src/common/interfaces';
import { CreateUserDto, UpdateUserDto, UserLoginDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<PaginationResult<User>> {
    try {
      return await this.userRepository.getAllUsers(page, limit);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error getting users');
    }
  }

  async getUserById(userId: number): Promise<User> {
    try {
      return await this.userRepository.getUserById(userId);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error getting user');
    }
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.createUser(userData);
    } catch (error) {
      Logger.error(error);
      if (error?.code?.includes('ER_DUP_ENTRY')) {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException('Error creating user');
      }
    }
  }

  async updateUser(
    userId: number,
    updateUserData: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    try {
      return await this.userRepository.updateUser(user.id, updateUserData);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      return await this.userRepository.deleteUser(userId);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  async login(
    userLoginData: UserLoginDto,
  ): Promise<{ token: string; userId: number }> {
    const { email, password } = userLoginData;

    const user = await this.getUserByEmail(email);
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return { token, userId: user.id };
  }

  private async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Error getting user by email: ${email}`,
      );
    }
  }
}
