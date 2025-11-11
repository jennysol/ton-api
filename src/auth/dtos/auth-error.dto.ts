import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthValidationErrorDto {
  @ApiProperty({
    description: 'Status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error messages',
    example: ['Email must have a valid format', 'Password is required'],
  })
  message: string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;
}

export class CreateAuthUserUnauthorizedDto {
  @ApiProperty({
    description: 'Status code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error type',
    example: 'Unauthorized',
  })
  error: string;
}

export class CreateAuthEmailConflictDto {
  @ApiProperty({
    description: 'Status code',
    example: 409,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Email already in use',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Conflict',
  })
  error: string;
}
