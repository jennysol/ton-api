import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductsRepository } from './repositories/product.repository';
import { ProductsController } from './controllers/product.controller';

@Module({
  providers: [ProductService, ProductsRepository],
  exports: [ProductService],
  controllers: [ProductsController],
})
export class ProductsModule {}
