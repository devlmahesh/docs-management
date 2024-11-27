import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../auth/role.enum';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User),
    ) as jest.Mocked<Repository<User>>;
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'password123',
        role: Role.VIEWER,
        email: 'test@example.com',
      };
      const savedUser = {
        id: 1,
        username: 'testuser',
        password: 'password123',
        role: Role.VIEWER,
        email: 'test@example.com',
        documents: [],
      };

      userRepository.create.mockReturnValue(createUserDto as User);
      userRepository.save.mockResolvedValue(savedUser as User);

      const result = await userService.create(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(savedUser);
    });
  });

  describe('findOne', () => {
    it('should find a user by username', async () => {
      const username = 'testuser';
      const user = {
        id: 1,
        username,
        password: 'password123',
        role: Role.VIEWER,
        email: 'test@example.com',
        documents: [],
      };

      userRepository.findOne.mockResolvedValue(user as User);

      const result = await userService.findOne(username);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const username = 'nonexistentuser';

      userRepository.findOne.mockResolvedValue(null);

      const result = await userService.findOne(username);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 1,
          username: 'user1',
          role: Role.VIEWER,
          email: 'user1@example.com',
          documents: [],
        },
        {
          id: 2,
          username: 'user2',
          role: Role.ADMIN,
          email: 'user2@example.com',
          documents: [],
        },
      ];

      userRepository.find.mockResolvedValue(users as User[]);

      const result = await userService.findAll();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('updateRole', () => {
    it("should update a user's role", async () => {
      const userId = 1;
      const newRole = Role.ADMIN;
      const user = {
        id: userId,
        username: 'testuser',
        role: Role.VIEWER,
        email: 'test@example.com',
        documents: [],
      };

      userRepository.findOne.mockResolvedValue(user as User);
      userRepository.save.mockResolvedValue({ ...user, role: newRole } as User);

      const result = await userService.updateRole(userId, newRole);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        role: newRole,
      });
      expect(result).toEqual({ ...user, role: newRole });
    });

    it('should throw an error if user is not found', async () => {
      const userId = 999;
      const newRole = Role.ADMIN;

      userRepository.findOne.mockResolvedValue(null);

      await expect(userService.updateRole(userId, newRole)).rejects.toThrow();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
