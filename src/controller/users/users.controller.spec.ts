import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from 'src/service/users/users.service';
import { CreateUserDto } from 'src/model/dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let userservice: UsersService;

  // Mock data
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  ];

  // Mock service
  const mockUsersService = {
    getusers: jest.fn(),
    finduser: jest.fn(),
    createuser: jest.fn(),
    remove: jest.fn(),
    joingroups: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userservice = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getusers', () => {
    it('should return all users', async () => {
      // Arrange
      mockUsersService.getusers.mockResolvedValue(mockUsers);

      // Act
      const result = await controller.getusers();

      // Assert
      expect(result).toEqual({
        mesage: 'success',
        data: mockUsers,
      });
      expect(mockUsersService.getusers).toHaveBeenCalled();
    });
  });

  describe('finduser', () => {
    it('should return a single user by id', async () => {
      // Arrange
      mockUsersService.finduser.mockResolvedValue(mockUser);

      // Act
      const result = await controller.finduser('1');

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockUser,
      });
      expect(mockUsersService.finduser).toHaveBeenCalledWith('1');
    });
  });

  describe('createuser', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        username: 'John Doe',
        email: 'john@example.com',
        password: 'password'
      };
      mockUsersService.createuser.mockResolvedValue(mockUser);

      // Act
      const result = await controller.createuser(createUserDto);

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockUser,
      });
      expect(mockUsersService.createuser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('deleteuser', () => {
    it('should delete a user', async () => {
      // Arrange
      mockUsersService.remove.mockResolvedValue({ deleted: true });

      // Act
      const result = await controller.deleteuser('1');

      // Assert
      expect(result).toEqual({ deleted: true });
      expect(mockUsersService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('joinroom', () => {
    it('should add user to a room', async () => {
      // Arrange
      const body = { id: 'room1', uid: 'user1' };
      mockUsersService.joingroups.mockResolvedValue(undefined);

      // Act
      const result = await controller.joinroom(body, 'room1');

      // Assert
      expect(result).toEqual({
        message: 'success',
      });
      expect(mockUsersService.joingroups).toHaveBeenCalledWith('room1', 'user1');
    });
  });
});
