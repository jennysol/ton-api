import { IProduct } from '../interfaces/products.interface';
import { ApiProperty } from '@nestjs/swagger';

export class findAllResponseDto {
  @ApiProperty({
    description: 'List of products',
    example: [
      {
        productId: 'product-id',
        title: 'T3 Smart Pro',
        description: 'Latest smartphone with amazing features',
        price: 999.99,
        publishDate: '2024-01-15',
        photoLink: 'https://example.com/photo.jpg',
      },
    ],
  })
  products: IProduct[];

  @ApiProperty({
    description: 'Next key for pagination',
    example: 'next-dfg4r34fdg',
  })
  nextKey: string | null;
}
