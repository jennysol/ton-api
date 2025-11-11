import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IPaginatedProducts, IProduct } from '../interfaces/products.interface';
import { Product } from '../products.entity';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class ProductsRepository {
  private readonly logger = new Logger(ProductsRepository.name, {
    timestamp: true,
  });

  async findById(productId: string): Promise<IProduct> {
    try {
      const result = await Product.get({ productId }).go();

      if (!result.data) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      return result.data;
    } catch (error) {
      this.logger.error('Error finding product by ID:', error);
      throw error;
    }
  }

  async findAll(limit: number, nextKey?: string): Promise<IPaginatedProducts> {
    try {
      const result = await Product.scan.go({
        limit,
        cursor: nextKey || null,
      });

      return {
        products: result.data,
        nextKey: result.cursor || null,
      };
    } catch (error) {
      this.logger.error('Error finding paginated products:', error);
      throw error;
    }
  }

  async create(userData: CreateProductDto): Promise<IProduct> {
    try {
      const { data } = await Product.create({
        productId: uuidv4(),
        title: userData.title,
        description: userData.description,
        price: userData.price,
        publishDate: userData.publishDate,
        photoLink: userData.photoLink,
      }).go();

      return data;
    } catch (error) {
      this.logger.error('Error creating product:', error);
      throw error;
    }
  }

  async update(
    productId: string,
    updateData: Partial<Omit<IProduct, 'productId'>>,
  ): Promise<IProduct> {
    try {
      const existingProduct = await this.findById(productId);
      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([, v]) => v !== undefined),
      );

      const { data } = await Product.update({ productId })
        .set(filteredData)
        .go({
          response: 'updated_new',
        });

      return data as IProduct;
    } catch (error) {
      this.logger.error('Error updating product:', error);
      throw error;
    }
  }
  async delete(productId: string): Promise<void> {
    try {
      await Product.delete({ productId }).go();
    } catch (error) {
      this.logger.error('Error deleting product:', error);
      throw error;
    }
  }
}
