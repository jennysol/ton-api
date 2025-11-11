import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedDto {
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

export class NotFoundDto {
  @ApiProperty({
    description: 'Status code',
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error type',
    example: 'Not Found',
  })
  error: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Product with ID product-id not found',
  })
  message: string;
}
