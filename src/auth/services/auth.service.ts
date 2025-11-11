import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/services/user.service';
import { IUser } from '../../users/interfaces/user.interface';
import { SignupDto, SignupResponseDto } from '../dtos/signup.dto';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import { EncryptionService } from '../../common/services/encryption/encryption.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, {
    timestamp: true,
  });
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async signup(body: SignupDto): Promise<SignupResponseDto> {
    try {
      const existingUser = await this.userService.findByEmail(body.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      const passwordHash = await this.encryptionService.hashPassword(
        body.password,
      );

      const newUser = await this.userService.create({
        name: body.name,
        email: body.email,
        passwordHash,
      });

      return {
        message: 'User created successfully',
        user: {
          userId: newUser.userId,
          name: newUser.name,
          email: newUser.email,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      this.logger.error('Error during signup:', error);
      throw error;
    }
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<IUser, 'passwordHash'> | null> {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user || !user.passwordHash) return null;

      const isPasswordValid = await this.encryptionService.comparePassword(
        pass,
        user.passwordHash,
      );

      if (!isPasswordValid) return null;

      return {
        userId: user.userId,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      this.logger.error('Error during user validation:', error);
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        email: user.email,
        sub: user.userId,
      };

      return {
        accessToken: this.jwtService.sign(payload),
        user: { userId: user.userId, email: user.email, name: user.name },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error('Error during login:', error);
      throw error;
    }
  }
}
