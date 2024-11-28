import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../auth/role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  // Find user by username
  async findOne(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  // Find user by user id
  async findOneById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  // Get all users by Admin only
  async findAll() {
    return this.userRepository.find({});
  }

  // Update user role by Admin only
  async updateRole(id: number, role: Role) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.role = role;
    return this.userRepository.save(user);
  }
}
