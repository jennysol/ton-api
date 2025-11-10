import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import { SignupDto, SignupResponseDto } from '../dto/signup.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockSignupDto: SignupDto = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  const mockLoginResponse: LoginResponseDto = {
    accessToken: 'mock-jwt-token',
    user: {
      userId: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    },
  };

  const mockSignupResponse: SignupResponseDto = {
    message: 'User created successfully',
    user: {
      userId: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      signup: jest.fn(),
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('login', () => {
    it('should return access token and user data when login is successful', async () => {
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(mockLoginResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const unauthorizedException = new UnauthorizedException(
        'Invalid credentials',
      );
      authService.login.mockRejectedValue(unauthorizedException);

      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should handle service errors properly', async () => {
      const serviceError = new Error('Service unavailable');
      authService.login.mockRejectedValue(serviceError);

      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        serviceError,
      );
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should validate login response structure', async () => {
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.userId).toBeDefined();
      expect(result.user.email).toBeDefined();
      expect(result.user.name).toBeDefined();
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });
  });

  describe('signup', () => {
    it('should create user successfully and return user data', async () => {
      authService.signup.mockResolvedValue(mockSignupResponse);

      const result = await controller.signup(mockSignupDto);

      expect(result).toEqual(mockSignupResponse);
      expect(authService.signup).toHaveBeenCalledWith(mockSignupDto);
      expect(authService.signup).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when email already exists', async () => {
      const conflictException = new ConflictException('Email already in use');
      authService.signup.mockRejectedValue(conflictException);

      await expect(controller.signup(mockSignupDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(controller.signup(mockSignupDto)).rejects.toThrow(
        'Email already in use',
      );
      expect(authService.signup).toHaveBeenCalledWith(mockSignupDto);
    });

    it('should handle service errors during signup', async () => {
      const serviceError = new Error('Database connection failed');
      authService.signup.mockRejectedValue(serviceError);

      await expect(controller.signup(mockSignupDto)).rejects.toThrow(
        serviceError,
      );
      expect(authService.signup).toHaveBeenCalledWith(mockSignupDto);
    });

    it('should validate signup response structure', async () => {
      authService.signup.mockResolvedValue(mockSignupResponse);

      const result = await controller.signup(mockSignupDto);

      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.userId).toBeDefined();
      expect(result.user.email).toBeDefined();
      expect(result.user.name).toBeDefined();
      expect(authService.signup).toHaveBeenCalledWith(mockSignupDto);
    });

    it('should return user data without password', async () => {
      authService.signup.mockResolvedValue(mockSignupResponse);

      const result = await controller.signup(mockSignupDto);

      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).toEqual({
        userId: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
      });
    });
  });

  describe('Controller initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have auth service injected', () => {
      expect(controller['authService']).toBeDefined();
      expect(controller['authService']).toBe(authService);
    });
  });
});
