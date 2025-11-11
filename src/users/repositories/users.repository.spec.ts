import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { IUser } from '../interfaces/users.interface';
import { CreateUserDto } from '../dtos/create-user.dto';

jest.mock('../users.entity', () => ({
  User: {
    get: jest.fn(),
    scan: {
      where: jest.fn(),
      go: jest.fn(),
    },
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
      byEmail: jest.fn(),
    },
  },
}));

const mockUuidV4 = jest.fn();
jest.mock('uuid', () => ({
  v4: mockUuidV4,
}));

import { UsersRepository } from './users.repository';
import { User } from '../users.entity';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockUser: jest.Mocked<typeof User>;

  const mockUserData: IUser = {
    userId: 'user-id',
    name: 'First Name',
    email: 'user@example.com',
    passwordHash: 'hashed-password',
  };

  const mockCreateUserDto: CreateUserDto = {
    name: 'New User',
    email: 'new@example.com',
    passwordHash: 'new-hashed-password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRepository],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    mockUser = User as jest.Mocked<typeof User>;

    mockUuidV4.mockReturnValue('mock-uuid-123');

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const email = 'user@example.com';
      const mockByEmail = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: [mockUserData],
        }),
      });
      mockUser.query.byEmail = mockByEmail;

      const result = await repository.findByEmail(email);

      expect(result).toEqual(mockUserData);
      expect(mockByEmail).toHaveBeenCalledWith({ email });
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';
      const mockByEmail = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: [],
        }),
      });
      mockUser.query.byEmail = mockByEmail;

      const result = await repository.findByEmail(email);

      expect(result).toBeNull();
      expect(mockByEmail).toHaveBeenCalledWith({ email });
    });

    it('should throw error when database operation fails', async () => {
      const email = 'user@example.com';
      const error = new Error('Database error');
      const mockByEmail = jest.fn().mockReturnValue({
        go: jest.fn().mockRejectedValue(error),
      });
      mockUser.query.byEmail = mockByEmail;

      await expect(repository.findByEmail(email)).rejects.toThrow(
        'Database error',
      );
      expect(mockByEmail).toHaveBeenCalledWith({ email });
    });
  });

  describe('create', () => {
    it('should create and return new user', async () => {
      const expectedUser = {
        ...mockCreateUserDto,
        userId: 'mock-uuid-123',
      };

      const mockCreate = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: expectedUser,
        }),
      });
      mockUser.create = mockCreate;

      const result = await repository.create(mockCreateUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockCreate).toHaveBeenCalledWith({
        userId: 'mock-uuid-123',
        name: mockCreateUserDto.name,
        email: mockCreateUserDto.email,
        passwordHash: mockCreateUserDto.passwordHash,
      });
    });

    it('should throw error when creation fails', async () => {
      const error = new Error('Creation failed');
      const mockCreate = jest.fn().mockReturnValue({
        go: jest.fn().mockRejectedValue(error),
      });
      mockUser.create = mockCreate;

      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      await expect(repository.create(mockCreateUserDto)).rejects.toThrow(
        'Creation failed',
      );
      expect(loggerSpy).toHaveBeenCalledWith('Error creating user:', error);

      loggerSpy.mockRestore();
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const email = 'user@example.com';
      const updateData = { name: 'Updated Name' };
      const updatedUser = { ...mockUserData, name: 'Updated Name' };

      const mockByEmail = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: [mockUserData],
        }),
      });
      mockUser.query.byEmail = mockByEmail;

      const mockUpdate = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          go: jest.fn().mockResolvedValue({
            data: updatedUser,
          }),
        }),
      });
      mockUser.update = mockUpdate;

      const result = await repository.update(email, updateData);

      expect(result).toEqual(updatedUser);
      expect(mockByEmail).toHaveBeenCalledWith({ email });
      expect(mockUpdate).toHaveBeenCalledWith({
        userId: mockUserData.userId,
        name: mockUserData.name,
        email: mockUserData.email,
      });
    });

    it('should return null when user not found for update', async () => {
      const email = 'nonexistent@example.com';
      const updateData = { name: 'Updated Name' };

      const mockByEmail = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: [],
        }),
      });
      mockUser.query.byEmail = mockByEmail;

      const result = await repository.update(email, updateData);

      expect(result).toBeNull();
      expect(mockByEmail).toHaveBeenCalledWith({ email });
    });

    it('should throw error when update fails', async () => {
      const email = 'user@example.com';
      const updateData = { name: 'Updated Name' };
      const error = new Error('Update failed');

      const mockByEmail = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: [mockUserData],
        }),
      });
      mockUser.query.byEmail = mockByEmail;

      const mockUpdate = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          go: jest.fn().mockRejectedValue(error),
        }),
      });
      mockUser.update = mockUpdate;

      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      await expect(repository.update(email, updateData)).rejects.toThrow(
        'Update failed',
      );
      expect(loggerSpy).toHaveBeenCalledWith('Error updating user:', error);

      loggerSpy.mockRestore();
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const email = 'user@example.com';

      const mockByEmail = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: [mockUserData],
        }),
      });
      mockUser.query.byEmail = mockByEmail;

      const mockDelete = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({}),
      });
      mockUser.delete = mockDelete;

      await repository.delete(email);

      expect(mockByEmail).toHaveBeenCalledWith({ email });
      expect(mockDelete).toHaveBeenCalledWith({
        userId: mockUserData.userId,
        name: mockUserData.name,
        email: mockUserData.email,
      });
    });

    it('should not attempt to delete when user not found', async () => {
      const email = 'nonexistent@example.com';

      const mockByEmail = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: [],
        }),
      });
      mockUser.query.byEmail = mockByEmail;

      const mockDelete = jest.fn();
      mockUser.delete = mockDelete;

      await repository.delete(email);

      expect(mockByEmail).toHaveBeenCalledWith({ email });
      expect(mockDelete).not.toHaveBeenCalled();
    });

    it('should throw error when delete fails', async () => {
      const email = 'user@example.com';
      const error = new Error('Delete failed');

      const mockByEmail = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: [mockUserData],
        }),
      });
      mockUser.query.byEmail = mockByEmail;

      const mockDelete = jest.fn().mockReturnValue({
        go: jest.fn().mockRejectedValue(error),
      });
      mockUser.delete = mockDelete;

      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      await expect(repository.delete(email)).rejects.toThrow('Delete failed');
      expect(loggerSpy).toHaveBeenCalledWith('Error deleting user:', error);

      loggerSpy.mockRestore();
    });
  });
});
