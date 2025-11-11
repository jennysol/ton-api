import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UsersRepository } from '../repositories/user.repository';
import { IUser } from '../interfaces/user.interface';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let usersRepository: jest.Mocked<UsersRepository>;

  const mockUser: IUser = {
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
    const mockUsersRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepository = module.get<UsersRepository>(
      UsersRepository,
    ) as jest.Mocked<UsersRepository>;

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';
      usersRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw error when repository throws error', async () => {
      const email = 'user@example.com';
      const error = new Error('Repository error');
      usersRepository.findByEmail.mockRejectedValue(error);

      await expect(service.findByEmail(email)).rejects.toThrow(
        'Repository error',
      );
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('create', () => {
    it('should create and return new user', async () => {
      const expectedUser = { ...mockCreateUserDto, userId: 'new-user-id' };
      usersRepository.create.mockResolvedValue(expectedUser);

      const result = await service.create(mockCreateUserDto);

      expect(result).toEqual(expectedUser);
      expect(usersRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should throw error when repository throws error', async () => {
      const error = new Error('Creation failed');
      usersRepository.create.mockRejectedValue(error);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        'Creation failed',
      );
      expect(usersRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const email = 'test@example.com';
      const updateData = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      usersRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update(email, updateData);

      expect(result).toEqual(updatedUser);
      expect(usersRepository.update).toHaveBeenCalledWith(email, updateData);
    });

    it('should return null when user not found for update', async () => {
      const email = 'nonexistent@example.com';
      const updateData = { name: 'Updated Name' };
      usersRepository.update.mockResolvedValue(null);

      const result = await service.update(email, updateData);

      expect(result).toBeNull();
      expect(usersRepository.update).toHaveBeenCalledWith(email, updateData);
    });

    it('should throw error when repository throws error', async () => {
      const email = 'test@example.com';
      const updateData = { name: 'Updated Name' };
      const error = new Error('Update failed');
      usersRepository.update.mockRejectedValue(error);

      await expect(service.update(email, updateData)).rejects.toThrow(
        'Update failed',
      );
      expect(usersRepository.update).toHaveBeenCalledWith(email, updateData);
    });

    it('should handle partial updates correctly', async () => {
      const email = 'test@example.com';
      const updateData = { passwordHash: 'new-hashed-password' };
      const updatedUser = { ...mockUser, passwordHash: 'new-hashed-password' };
      usersRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update(email, updateData);

      expect(result).toEqual(updatedUser);
      expect(usersRepository.update).toHaveBeenCalledWith(email, updateData);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const email = 'test@example.com';
      usersRepository.delete.mockResolvedValue(undefined);

      await service.delete(email);

      expect(usersRepository.delete).toHaveBeenCalledWith(email);
    });

    it('should throw error when repository throws error', async () => {
      const email = 'test@example.com';
      const error = new Error('Delete failed');
      usersRepository.delete.mockRejectedValue(error);

      await expect(service.delete(email)).rejects.toThrow('Delete failed');
      expect(usersRepository.delete).toHaveBeenCalledWith(email);
    });
  });

  describe('Service initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have users repository injected', () => {
      expect(service['usersRepository']).toBeDefined();
      expect(service['usersRepository']).toBe(usersRepository);
    });
  });
});
