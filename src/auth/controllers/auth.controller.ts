import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import { SignupDto, SignupResponseDto } from '../dtos/signup.dto';
import {
  CreateAuthValidationErrorDto,
  CreateAuthUserUnauthorizedDto,
  CreateAuthEmailConflictDto,
} from '../dtos/auth-error.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Authenticate user',
    description: 'Authenticates a user and returns a JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: CreateAuthValidationErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: CreateAuthUserUnauthorizedDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new user account in the system',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: SignupResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: CreateAuthValidationErrorDto,
  })
  @ApiConflictResponse({
    description: 'Email already in use',
    type: CreateAuthEmailConflictDto,
  })
  async signup(@Body() body: SignupDto): Promise<SignupResponseDto> {
    return this.authService.signup(body);
  }
}
