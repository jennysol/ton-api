import { IProduct } from '../interfaces/product.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto implements Omit<IProduct, 'productId'> {
  @ApiProperty({
    description: 'Product title',
    example: 'T3 Smart Pro',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest smartphone with amazing features',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Product publish date',
    example: '2024-01-15',
  })
  @IsString()
  publishDate: string;

  @ApiProperty({
    description: 'Product photo URL',
    example: 'https://example.com/photo.jpg',
  })
  @IsString()
  photoLink: string;
}

export class CreateProductResponseDto implements IProduct {
  @ApiProperty({
    description: 'Product ID',
    example: 'product-id',
  })
  productId: string;

  @ApiProperty({
    description: 'Product title',
    example: 'T3 Smart Pro',
  })
  title: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest smartphone with amazing features',
  })
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'Product publish date',
    example: '2024-01-15',
  })
  publishDate: string;

  @ApiProperty({
    description: 'Product photo URL',
    example: 'https://example.com/photo.jpg',
  })
  photoLink: string;
}
