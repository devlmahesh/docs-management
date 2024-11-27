import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call register method of AuthService and return user', async () => {
      const userDto = {
        username: 'testuser',
        password: 'password123',
        role: 'USER',
      };
      const result = { id: 1, ...userDto, password: 'hashedpassword' };

      // Mock the register method of AuthService to return a user
      authService.register = jest.fn().mockResolvedValue(result);

      const response = await controller.register(userDto);

      expect(authService.register).toHaveBeenCalledWith(userDto);
      expect(response).toEqual(result);
    });
  });

  describe('login', () => {
    it('should call login method of AuthService and return access token', async () => {
      const userDto = { username: 'testuser', password: 'password123' };
      const result = { access_token: 'jwt_token' };

      // Mock the login method of AuthService to return a token
      authService.login = jest.fn().mockResolvedValue(result);

      const response = await controller.login(userDto);

      expect(authService.login).toHaveBeenCalledWith(userDto);
      expect(response).toEqual(result);
    });

    it('should throw an error if login fails', async () => {
      const userDto = { username: 'testuser', password: 'wrongpassword' };

      // Mock login to throw an error for invalid credentials
      authService.login = jest
        .fn()
        .mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(userDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
