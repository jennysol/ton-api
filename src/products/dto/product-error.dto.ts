import { ApiProperty } from '@nestjs/swagger';

export class CreateProductValidationErrorDto {
  @ApiProperty({
    description: 'Status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error messages',
    example: ['Title is required', 'Price must be a positive number'],
  })
  message: string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;
}
