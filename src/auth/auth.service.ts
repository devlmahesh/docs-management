import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // Register user
  async register(userDto: CreateUserDto) {
    const existingUser = await this.userService.findOne(userDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });
    return { message: 'User registered successfully', user: newUser };
  }

  // Login user
  async login(userDto: UserLoginDto) {
    const user = await this.userService.findOne(userDto.username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      message: 'Login successful',
    };
  }
}
