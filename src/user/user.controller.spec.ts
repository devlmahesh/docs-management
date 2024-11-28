import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Role } from '../auth/role.enum';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockUserService = {
      create: jest.fn(),
      findAll: jest.fn(),
      updateRole: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService) as jest.Mocked<UserService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Define the DTO to be passed to the controller (without the 'id', 'email', and 'documents' fields)
      const createUserDto = {
        username: 'testuser',
        password: 'password123',
        role: Role.VIEWER,
        email: 'testuser@example.com', // Ensure email is included
        documents: [], // Ensure documents is included
      };

      // Define the created user object, including the missing fields that are expected in the final response
      const createdUser = {
        id: 1,
        username: 'testuser',
        password: 'password123',
        role: Role.VIEWER,
        email: 'testuser@example.com', // Ensure email is included
        documents: [], // Ensure documents is included
      };

      // Mock the return value of userService.create to return the createdUser object
      userService.create.mockResolvedValue(createdUser);

      // Call the controller's create method, passing the createUserDto
      const result = await controller.create(createUserDto);

      // Assertions to check if the controller method behaves correctly
      expect(userService.create).toHaveBeenCalledWith(createUserDto); // Check that service was called with the correct DTO
      expect(result).toEqual(createdUser); // Check that the result matches the expected created user
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 1,
          username: 'user1',
          role: Role.ADMIN,
          email: 'user1@example.com',
          password: 'password1',
          documents: [],
        },
        {
          id: 2,
          username: 'user2',
          role: Role.VIEWER,
          email: 'user2@example.com',
          password: 'password2',
          documents: [],
        },
      ];

      // Mock the return value of userService.findAll
      userService.findAll.mockResolvedValue(users);

      // Call the findAll method of the controller
      const result = await controller.findAll();

      // Assertions
      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('updateRole', () => {
    it('should update a user role', async () => {
      const userId = 1;
      const newRole = Role.ADMIN;
      const updatedUser = {
        id: userId,
        username: 'user1',
        role: newRole,
        email: 'user1@example.com',
        password: 'password1',
        documents: [],
      };

      // Mock the return value of userService.updateRole
      userService.updateRole.mockResolvedValue(updatedUser);

      // Call the updateRole method of the controller
      const result = await controller.updateRole(userId, { role: newRole });

      // Assertions
      expect(userService.updateRole).toHaveBeenCalledWith(userId, newRole);
      expect(result).toEqual(updatedUser);
    });
  });
});
