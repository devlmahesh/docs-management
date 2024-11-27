import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { Role } from './role.enum';

jest.mock('bcrypt'); // Mock bcrypt library
jest.mock('../user/user.service'); // Mock UserService

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should hash the password and register the user', async () => {
      const userDto = {
        username: 'testuser',
        password: 'password123',
        role: Role.ADMIN,
        email: 'contact@gmail.com',
      };

      const hashedPassword = 'hashedpassword';

      // Mock bcrypt hash function
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Mock the userService.create method to return a user object with hashed password
      const createdUser = { ...userDto, password: hashedPassword, id: 1 };
      userService.create = jest.fn().mockResolvedValue(createdUser);

      const result = await service.register(userDto);

      // Check if bcrypt.hash and userService.create were called with correct values
      expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, 10);
      expect(userService.create).toHaveBeenCalledWith({
        ...userDto,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    it('should return an access token if credentials are valid', async () => {
      const userDto = { username: 'testuser', password: 'password123' };

      const user = {
        id: 1,
        username: 'testuser',
        password:
          '$2b$10$yOUu7I7FFU4E5SKo9JX.bm/q8g8Esh3zmk/3lmo/0b8QH4H9jwnJW', // hashed password for "password123"
        role: 'USER',
      };

      const payload = { userId: user.id, role: user.role };

      // Mock bcrypt compare method to return true
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      // Mock the userService.findOne method to return the user
      userService.findOne = jest.fn().mockResolvedValue(user);

      // Mock jwtService.sign method to return a token
      jwtService.sign = jest.fn().mockReturnValue('jwt_token');

      const result = await service.login(userDto);

      expect(userService.findOne).toHaveBeenCalledWith(userDto.username);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userDto.password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ access_token: 'jwt_token' });
    });

    it('should throw an error if credentials are invalid', async () => {
      const userDto = { username: 'testuser', password: 'wrongpassword' };

      const user = {
        id: 1,
        username: 'testuser',
        password:
          '$2b$10$yOUu7I7FFU4E5SKo9JX.bm/q8g8Esh3zmk/3lmo/0b8QH4H9jwnJW', // hashed password for "password123"
        role: 'USER',
      };

      // Mock bcrypt.compare to return false for incorrect password
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      // Mock the userService.findOne method to return the user
      userService.findOne = jest.fn().mockResolvedValue(user);

      await expect(service.login(userDto)).rejects.toThrowError(
        'Invalid credentials',
      );
    });
  });
});
