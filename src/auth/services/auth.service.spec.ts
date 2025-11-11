import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../../users/services/users.service';
import { IUser } from '../../users/interfaces/users.interface';
import { SignupDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { EncryptionService } from '../../common/services/encryption/encryption.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let encryptionService: jest.Mocked<EncryptionService>;

  const mockUser: IUser = {
    userId: 'user-id',
    name: 'First Name',
    email: 'user@example.com',
    passwordHash: 'hashed-password',
  };

  const mockSignupDto: SignupDto = {
    name: 'New User',
    email: 'new@example.com',
    password: 'password123',
  };

  const mockLoginDto: LoginDto = {
    email: 'user@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const mockUserService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockEncryptionService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
      generateSalt: jest.fn(),
      hashPasswordWithSalt: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
    encryptionService = module.get<EncryptionService>(
      EncryptionService,
    ) as jest.Mocked<EncryptionService>;

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const hashedPassword = 'hashed-password123';
      const createdUser = {
        ...mockUser,
        email: mockSignupDto.email,
        name: mockSignupDto.name,
        passwordHash: hashedPassword,
      };

      userService.findByEmail.mockResolvedValue(null);
      encryptionService.hashPassword.mockResolvedValue(hashedPassword);
      userService.create.mockResolvedValue(createdUser);

      const result = await service.signup(mockSignupDto);

      expect(result).toEqual({
        message: 'User created successfully',
        user: {
          userId: createdUser.userId,
          name: createdUser.name,
          email: createdUser.email,
        },
      });
      expect(userService.findByEmail).toHaveBeenCalledWith(mockSignupDto.email);
      expect(encryptionService.hashPassword).toHaveBeenCalledWith(
        mockSignupDto.password,
      );
      expect(userService.create).toHaveBeenCalledWith({
        name: mockSignupDto.name,
        email: mockSignupDto.email,
        passwordHash: hashedPassword,
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.signup(mockSignupDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.signup(mockSignupDto)).rejects.toThrow(
        'Email already in use',
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(mockSignupDto.email);
      expect(encryptionService.hashPassword).not.toHaveBeenCalled();
      expect(userService.create).not.toHaveBeenCalled();
    });

    it('should throw error when user creation fails', async () => {
      const error = new Error('Database error');
      userService.findByEmail.mockResolvedValue(null);
      encryptionService.hashPassword.mockResolvedValue('hashed-password');
      userService.create.mockRejectedValue(error);

      await expect(service.signup(mockSignupDto)).rejects.toThrow(error);
      expect(userService.findByEmail).toHaveBeenCalledWith(mockSignupDto.email);
      expect(encryptionService.hashPassword).toHaveBeenCalledWith(
        mockSignupDto.password,
      );
      expect(userService.create).toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      encryptionService.comparePassword.mockResolvedValue(true);

      const result = await service.validateUser(
        mockUser.email,
        'correct-password',
      );

      expect(result).toEqual({
        userId: mockUser.userId,
        name: mockUser.name,
        email: mockUser.email,
      });
      expect(userService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(encryptionService.comparePassword).toHaveBeenCalledWith(
        'correct-password',
        mockUser.passwordHash,
      );
    });

    it('should return null when user is not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password',
      );

      expect(result).toBeNull();
      expect(userService.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(encryptionService.comparePassword).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      encryptionService.comparePassword.mockResolvedValue(false);

      const result = await service.validateUser(
        mockUser.email,
        'wrong-password',
      );

      expect(result).toBeNull();
      expect(userService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(encryptionService.comparePassword).toHaveBeenCalledWith(
        'wrong-password',
        mockUser.passwordHash,
      );
    });

    it('should return null when an error occurs during validation', async () => {
      const error = new Error('Database error');
      userService.findByEmail.mockRejectedValue(error);

      const result = await service.validateUser(mockUser.email, 'password');

      expect(result).toBeNull();
      expect(userService.findByEmail).toHaveBeenCalledWith(mockUser.email);
    });
  });

  describe('login', () => {
    it('should return access token and user data when credentials are valid', async () => {
      const mockToken = 'mock-jwt-token';
      const validUser = {
        userId: mockUser.userId,
        name: mockUser.name,
        email: mockUser.email,
      };

      userService.findByEmail.mockResolvedValue(mockUser);
      encryptionService.comparePassword.mockResolvedValue(true);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockLoginDto);

      expect(result).toEqual({
        accessToken: mockToken,
        user: validUser,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.userId,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      encryptionService.comparePassword.mockResolvedValue(false);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should rethrow UnauthorizedException when validation fails', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('Service initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have users service injected', () => {
      expect(service['userService']).toBeDefined();
      expect(service['userService']).toBe(userService);
    });

    it('should have JWT service injected', () => {
      expect(service['jwtService']).toBeDefined();
      expect(service['jwtService']).toBe(jwtService);
    });

    it('should have encryption service injected', () => {
      expect(service['encryptionService']).toBeDefined();
      expect(service['encryptionService']).toBe(encryptionService);
    });
  });
});
