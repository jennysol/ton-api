import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/product.repository';
import { IPaginatedProducts, IProduct } from '../interfaces/product.interface';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findById(productId: string): Promise<IProduct> {
    return await this.productsRepository.findById(productId);
  }

  async findAll(limit: number, nextKey?: string): Promise<IPaginatedProducts> {
    return await this.productsRepository.findAll(limit, nextKey);
  }

  async create(createProductDto: CreateProductDto): Promise<IProduct> {
    return await this.productsRepository.create(createProductDto);
  }

  async update(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<IProduct> {
    return await this.productsRepository.update(productId, updateProductDto);
  }

  async delete(productId: string): Promise<void> {
    await this.productsRepository.delete(productId);
  }
}
