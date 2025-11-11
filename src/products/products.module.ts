import { Module } from '@nestjs/common';
import { ProductService } from './services/products.service';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsController } from './controllers/products.controller';

@Module({
  providers: [ProductService, ProductsRepository],
  exports: [ProductService],
  controllers: [ProductsController],
})
export class ProductsModule {}
