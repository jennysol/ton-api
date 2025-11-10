import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ProductService } from '../services/products.service';
import {
  CreateProductDto,
  CreateProductResponseDto,
} from '../dto/create-product.dto';
import { IProduct, IPaginatedProducts } from '../interfaces/products.interface';
import { JwtAuthGuard } from '../../auth/guard/auth.guard';
import { UpdateProductDto } from '../dto/update-product.dto';
import { findAllResponseDto } from '../dto/find-all.dto';
import { CreateProductValidationErrorDto } from '../dto/product-error.dto';
import { NotFoundDto } from '../../common/dto/errors.dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ProductsController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of products per page',
    example: 10,
  })
  @ApiQuery({
    name: 'nextKey',
    required: false,
    type: String,
    description: 'Pagination cursor for next page',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
    type: findAllResponseDto,
  })
  async findAll(
    @Query('limit') limit: string = '10',
    @Query('nextKey') nextKey?: string,
  ): Promise<IPaginatedProducts> {
    return await this.productsService.findAll(Number(limit), nextKey);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product found',
    type: CreateProductDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async findById(@Param('id') id: string): Promise<IProduct> {
    return await this.productsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    type: CreateProductDto,
    description: 'Product data',
    examples: {
      example1: {
        summary: 'Product example',
        value: {
          title: 'T3 Smart Pro',
          description: 'Latest smartphone with amazing features',
          price: 999.99,
          publishDate: '2024-01-15',
          photoLink: 'https://example.com/photo.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    type: CreateProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid product data',
    type: CreateProductValidationErrorDto,
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<IProduct> {
    return await this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Updated product data',
    examples: {
      example1: {
        summary: 'Update example',
        value: {
          title: 'Updated T3 Smart Pro',
          price: 899.99,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
    type: CreateProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
    type: NotFoundDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid product data',
    type: CreateProductValidationErrorDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<IProduct> {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
    type: NotFoundDto,
  })
  async delete(@Param('id') id: string): Promise<void> {
    return await this.productsService.delete(id);
  }
}
