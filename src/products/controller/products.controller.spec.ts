import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { IProduct, IPaginatedProducts } from '../interfaces/products.interface';
import { UpdateProductDto } from '../dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: jest.Mocked<ProductService>;

  const mockProduct: IProduct = {
    productId: 'test-product-id',
    title: 'Product Title',
    description: 'Product Description',
    price: 99.99,
    publishDate: '2024-01-15',
    photoLink: 'https://example.com/photo.jpg',
  };

  const mockCreateProductDto: CreateProductDto = {
    title: 'New Product',
    description: 'New Description',
    price: 199.99,
    publishDate: '2024-02-15',
    photoLink: 'https://example.com/new-photo.jpg',
  };

  const mockUpdateProductDto: UpdateProductDto = {
    title: 'Updated Product',
    price: 299.99,
  };

  const mockPaginatedProducts: IPaginatedProducts = {
    products: [mockProduct],
    nextKey: 'next-cursor',
  };

  beforeEach(async () => {
    const mockProductsService = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductService>(
      ProductService,
    ) as jest.Mocked<ProductService>;

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated products with default limit', async () => {
      productsService.findAll.mockResolvedValue(mockPaginatedProducts);

      const result = await controller.findAll();

      expect(result).toEqual(mockPaginatedProducts);
      expect(productsService.findAll).toHaveBeenCalledWith(10, undefined);
      expect(productsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return paginated products with custom limit', async () => {
      const limit = '5';
      productsService.findAll.mockResolvedValue(mockPaginatedProducts);

      const result = await controller.findAll(limit);

      expect(result).toEqual(mockPaginatedProducts);
      expect(productsService.findAll).toHaveBeenCalledWith(5, undefined);
    });

    it('should return paginated products with nextKey', async () => {
      const limit = '10';
      const nextKey = 'cursor-123';
      productsService.findAll.mockResolvedValue(mockPaginatedProducts);

      const result = await controller.findAll(limit, nextKey);

      expect(result).toEqual(mockPaginatedProducts);
      expect(productsService.findAll).toHaveBeenCalledWith(10, nextKey);
    });

    it('should handle service errors properly', async () => {
      const serviceError = new Error('Service unavailable');
      productsService.findAll.mockRejectedValue(serviceError);

      await expect(controller.findAll()).rejects.toThrow(serviceError);
      expect(productsService.findAll).toHaveBeenCalledWith(10, undefined);
    });

    it('should validate response structure', async () => {
      productsService.findAll.mockResolvedValue(mockPaginatedProducts);

      const result = await controller.findAll();

      expect(result).toBeDefined();
      expect(result.products).toBeDefined();
      expect(Array.isArray(result.products)).toBe(true);
      expect(result.nextKey).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      const productId = 'test-product-id';
      productsService.findById.mockResolvedValue(mockProduct);

      const result = await controller.findById(productId);

      expect(result).toEqual(mockProduct);
      expect(productsService.findById).toHaveBeenCalledWith(productId);
      expect(productsService.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when product not found', async () => {
      const productId = 'nonexistent-id';
      const error = new Error(`Product with ID ${productId} not found`);
      productsService.findById.mockRejectedValue(error);

      await expect(controller.findById(productId)).rejects.toThrow(
        `Product with ID ${productId} not found`,
      );
      expect(productsService.findById).toHaveBeenCalledWith(productId);
    });

    it('should handle service errors properly', async () => {
      const productId = 'test-product-id';
      const serviceError = new Error('Database connection failed');
      productsService.findById.mockRejectedValue(serviceError);

      await expect(controller.findById(productId)).rejects.toThrow(
        serviceError,
      );
      expect(productsService.findById).toHaveBeenCalledWith(productId);
    });

    it('should validate product response structure', async () => {
      const productId = 'test-product-id';
      productsService.findById.mockResolvedValue(mockProduct);

      const result = await controller.findById(productId);

      expect(result).toBeDefined();
      expect(result.productId).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.price).toBeDefined();
      expect(result.publishDate).toBeDefined();
      expect(result.photoLink).toBeDefined();
    });
  });

  describe('create', () => {
    it('should create product successfully and return product data', async () => {
      const expectedProduct = {
        ...mockCreateProductDto,
        productId: 'new-product-id',
      };
      productsService.create.mockResolvedValue(expectedProduct);

      const result = await controller.create(mockCreateProductDto);

      expect(result).toEqual(expectedProduct);
      expect(productsService.create).toHaveBeenCalledWith(mockCreateProductDto);
      expect(productsService.create).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors during creation', async () => {
      const serviceError = new Error('Database connection failed');
      productsService.create.mockRejectedValue(serviceError);

      await expect(controller.create(mockCreateProductDto)).rejects.toThrow(
        serviceError,
      );
      expect(productsService.create).toHaveBeenCalledWith(mockCreateProductDto);
    });

    it('should validate create response structure', async () => {
      const expectedProduct = {
        ...mockCreateProductDto,
        productId: 'new-product-id',
      };
      productsService.create.mockResolvedValue(expectedProduct);

      const result = await controller.create(mockCreateProductDto);

      expect(result).toBeDefined();
      expect(result.productId).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.price).toBeDefined();
      expect(result.publishDate).toBeDefined();
      expect(result.photoLink).toBeDefined();
      expect(productsService.create).toHaveBeenCalledWith(mockCreateProductDto);
    });

    it('should return product with generated productId', async () => {
      const expectedProduct = {
        ...mockCreateProductDto,
        productId: 'generated-uuid',
      };
      productsService.create.mockResolvedValue(expectedProduct);

      const result = await controller.create(mockCreateProductDto);

      expect(result.productId).toBeDefined();
      expect(result.productId).not.toEqual('');
      expect(result.title).toEqual(mockCreateProductDto.title);
      expect(result.description).toEqual(mockCreateProductDto.description);
      expect(result.price).toEqual(mockCreateProductDto.price);
    });
  });

  describe('update', () => {
    it('should update product successfully and return updated product', async () => {
      const productId = 'test-product-id';
      const updatedProduct = { ...mockProduct, ...mockUpdateProductDto };
      productsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(productId, mockUpdateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(productsService.update).toHaveBeenCalledWith(
        productId,
        mockUpdateProductDto,
      );
      expect(productsService.update).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when product not found for update', async () => {
      const productId = 'nonexistent-id';
      const error = new Error(`Product with ID ${productId} not found`);
      productsService.update.mockRejectedValue(error);

      await expect(
        controller.update(productId, mockUpdateProductDto),
      ).rejects.toThrow(`Product with ID ${productId} not found`);
      expect(productsService.update).toHaveBeenCalledWith(
        productId,
        mockUpdateProductDto,
      );
    });

    it('should handle service errors during update', async () => {
      const productId = 'test-product-id';
      const serviceError = new Error('Update operation failed');
      productsService.update.mockRejectedValue(serviceError);

      await expect(
        controller.update(productId, mockUpdateProductDto),
      ).rejects.toThrow(serviceError);
      expect(productsService.update).toHaveBeenCalledWith(
        productId,
        mockUpdateProductDto,
      );
    });

    it('should validate update response structure', async () => {
      const productId = 'test-product-id';
      const updatedProduct = { ...mockProduct, ...mockUpdateProductDto };
      productsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(productId, mockUpdateProductDto);

      expect(result).toBeDefined();
      expect(result.productId).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.price).toBeDefined();
      expect(result.publishDate).toBeDefined();
      expect(result.photoLink).toBeDefined();
      expect(productsService.update).toHaveBeenCalledWith(
        productId,
        mockUpdateProductDto,
      );
    });

    it('should handle partial updates correctly', async () => {
      const productId = 'test-product-id';
      const partialUpdate: UpdateProductDto = { price: 399.99 };
      const updatedProduct = { ...mockProduct, price: 399.99 };
      productsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(productId, partialUpdate);

      expect(result).toEqual(updatedProduct);
      expect(result.price).toEqual(399.99);
      expect(result.title).toEqual(mockProduct.title);
      expect(productsService.update).toHaveBeenCalledWith(
        productId,
        partialUpdate,
      );
    });
  });

  describe('delete', () => {
    it('should delete product successfully', async () => {
      const productId = 'test-product-id';
      productsService.delete.mockResolvedValue(undefined);

      await controller.delete(productId);

      expect(productsService.delete).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException when product not found for deletion', async () => {
      const productId = 'nonexistent-id';
      const error = new Error(`Product with ID ${productId} not found`);
      productsService.delete.mockRejectedValue(error);

      await expect(controller.delete(productId)).rejects.toThrow(
        `Product with ID ${productId} not found`,
      );
      expect(productsService.delete).toHaveBeenCalledWith(productId);
    });

    it('should handle service errors during deletion', async () => {
      const productId = 'test-product-id';
      const error = new Error('Database connection failed');
      productsService.delete.mockRejectedValue(error);

      await expect(controller.delete(productId)).rejects.toThrow(error);
      expect(productsService.delete).toHaveBeenCalledWith(productId);
    });
  });

  describe('Controller initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have products service injected', () => {
      expect(controller['productsService']).toBeDefined();
      expect(controller['productsService']).toBe(productsService);
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle very large valid limit', async () => {
      const maxLimit = '100';
      productsService.findAll.mockResolvedValue(mockPaginatedProducts);

      const result = await controller.findAll(maxLimit);

      expect(result).toEqual(mockPaginatedProducts);
      expect(productsService.findAll).toHaveBeenCalledWith(100, undefined);
    });

    it('should handle minimum valid limit', async () => {
      const minLimit = '1';
      productsService.findAll.mockResolvedValue(mockPaginatedProducts);

      const result = await controller.findAll(minLimit);

      expect(result).toEqual(mockPaginatedProducts);
      expect(productsService.findAll).toHaveBeenCalledWith(1, undefined);
    });
  });
});
