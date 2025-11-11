import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { IProduct } from '../interfaces/product.interface';
import { CreateProductDto } from '../dtos/create-product.dto';

jest.mock('../entities/product.entity', () => ({
  Product: {
    get: jest.fn(),
    scan: {
      where: jest.fn(),
      go: jest.fn(),
    },
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

const mockUuidV4 = jest.fn();
jest.mock('uuid', () => ({
  v4: mockUuidV4,
}));

import { ProductsRepository } from './product.repository';
import { Product } from '../entities/product.entity';

describe('ProductsRepository', () => {
  let repository: ProductsRepository;
  let mockProduct: jest.Mocked<typeof Product>;

  const mockProductData: IProduct = {
    productId: 'product-id',
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsRepository],
    }).compile();

    repository = module.get<ProductsRepository>(ProductsRepository);
    mockProduct = Product as jest.Mocked<typeof Product>;

    mockUuidV4.mockReturnValue('mock-uuid-123');

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      const productId = 'product-id';
      const mockGet = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: mockProductData,
        }),
      });
      mockProduct.get = mockGet;

      const result = await repository.findById(productId);

      expect(result).toEqual(mockProductData);
      expect(mockGet).toHaveBeenCalledWith({ productId });
    });

    it('should throw NotFoundException when product not found', async () => {
      const productId = 'nonexistent-id';
      const mockGet = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: null,
        }),
      });
      mockProduct.get = mockGet;

      await expect(repository.findById(productId)).rejects.toThrow(
        'Product with ID nonexistent-id not found',
      );
      expect(mockGet).toHaveBeenCalledWith({ productId });
    });

    it('should throw error when database operation fails', async () => {
      const productId = 'product-id';
      const error = new Error('Database error');
      const mockGet = jest.fn().mockReturnValue({
        go: jest.fn().mockRejectedValue(error),
      });
      mockProduct.get = mockGet;

      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      await expect(repository.findById(productId)).rejects.toThrow(
        'Database error',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Error finding product by ID:',
        error,
      );

      loggerSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const limit = 10;
      const products = [mockProductData];
      const cursor = 'next-cursor';

      const mockGo = jest.fn().mockResolvedValue({
        data: products,
        cursor,
      });

      (mockProduct.scan as any) = {
        go: mockGo,
      };

      const result = await repository.findAll(limit);

      expect(result).toEqual({
        products,
        nextKey: cursor,
      });
      expect(mockGo).toHaveBeenCalledWith({
        limit,
        cursor: null,
      });
    });

    it('should return paginated products with nextKey', async () => {
      const limit = 5;
      const nextKey = 'existing-cursor';
      const products = [mockProductData];
      const newCursor = 'new-cursor';

      const mockGo = jest.fn().mockResolvedValue({
        data: products,
        cursor: newCursor,
      });

      (mockProduct.scan as any) = {
        go: mockGo,
      };

      const result = await repository.findAll(limit, nextKey);

      expect(result).toEqual({
        products,
        nextKey: newCursor,
      });
      expect(mockGo).toHaveBeenCalledWith({
        limit,
        cursor: nextKey,
      });
    });

    it('should return empty array when no products found', async () => {
      const limit = 10;

      const mockGo = jest.fn().mockResolvedValue({
        data: [],
        cursor: null,
      });

      (mockProduct.scan as any) = {
        go: mockGo,
      };

      const result = await repository.findAll(limit);

      expect(result).toEqual({
        products: [],
        nextKey: null,
      });
    });

    it('should throw error when database operation fails', async () => {
      const limit = 10;
      const error = new Error('Database error');

      const mockGo = jest.fn().mockRejectedValue(error);

      (mockProduct.scan as any) = {
        go: mockGo,
      };

      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      await expect(repository.findAll(limit)).rejects.toThrow('Database error');
      expect(loggerSpy).toHaveBeenCalledWith(
        'Error finding paginated products:',
        error,
      );

      loggerSpy.mockRestore();
    });
  });

  describe('create', () => {
    it('should create and return new product', async () => {
      const expectedProduct = {
        ...mockCreateProductDto,
        productId: 'mock-uuid-123',
      };

      const mockCreate = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: expectedProduct,
        }),
      });
      mockProduct.create = mockCreate;

      const result = await repository.create(mockCreateProductDto);

      expect(result).toEqual(expectedProduct);
      expect(mockCreate).toHaveBeenCalledWith({
        productId: 'mock-uuid-123',
        title: mockCreateProductDto.title,
        description: mockCreateProductDto.description,
        price: mockCreateProductDto.price,
        publishDate: mockCreateProductDto.publishDate,
        photoLink: mockCreateProductDto.photoLink,
      });
    });

    it('should throw error when creation fails', async () => {
      const error = new Error('Creation failed');
      const mockCreate = jest.fn().mockReturnValue({
        go: jest.fn().mockRejectedValue(error),
      });
      mockProduct.create = mockCreate;

      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      await expect(repository.create(mockCreateProductDto)).rejects.toThrow(
        'Creation failed',
      );
      expect(loggerSpy).toHaveBeenCalledWith('Error creating product:', error);

      loggerSpy.mockRestore();
    });
  });

  describe('update', () => {
    it('should update and return product', async () => {
      const productId = 'product-id';
      const updateData = { title: 'Updated Title', price: 299.99 };
      const updatedProduct = { ...mockProductData, ...updateData };

      jest.spyOn(repository, 'findById').mockResolvedValue(mockProductData);

      const mockSet = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({
          data: updatedProduct,
        }),
      });

      const mockPatch = jest.fn().mockReturnValue({
        set: mockSet,
      });
      mockProduct.update = mockPatch;

      const result = await repository.update(productId, updateData);

      expect(result).toEqual(updatedProduct);
      expect(mockPatch).toHaveBeenCalledWith({ productId });
      expect(mockSet).toHaveBeenCalledWith(updateData);
    });

    it('should throw NotFoundException when product not found', async () => {
      const productId = 'nonexistent-id';
      const updateData = { title: 'Updated Title' };

      jest
        .spyOn(repository, 'findById')
        .mockRejectedValue(
          new Error('Product with ID nonexistent-id not found'),
        );

      await expect(repository.update(productId, updateData)).rejects.toThrow(
        'Product with ID nonexistent-id not found',
      );
    });

    it('should throw error when update fails', async () => {
      const productId = 'product-id';
      const updateData = { title: 'Updated Title' };
      const error = new Error('Update failed');

      jest.spyOn(repository, 'findById').mockResolvedValue(mockProductData);

      const mockSet = jest.fn().mockReturnValue({
        go: jest.fn().mockRejectedValue(error),
      });

      const mockPatch = jest.fn().mockReturnValue({
        set: mockSet,
      });
      mockProduct.update = mockPatch;

      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      await expect(repository.update(productId, updateData)).rejects.toThrow(
        'Update failed',
      );
      expect(loggerSpy).toHaveBeenCalledWith('Error updating product:', error);

      loggerSpy.mockRestore();
    });
  });

  describe('delete', () => {
    it('should delete product successfully', async () => {
      const productId = 'product-id';
      const mockDelete = jest.fn().mockReturnValue({
        go: jest.fn().mockResolvedValue({}),
      });
      mockProduct.delete = mockDelete;

      await repository.delete(productId);

      expect(mockDelete).toHaveBeenCalledWith({ productId });
    });

    it('should throw error when delete fails', async () => {
      const productId = 'product-id';
      const error = new Error('Delete failed');
      const mockDelete = jest.fn().mockReturnValue({
        go: jest.fn().mockRejectedValue(error),
      });
      mockProduct.delete = mockDelete;

      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      await expect(repository.delete(productId)).rejects.toThrow(
        'Delete failed',
      );
      expect(loggerSpy).toHaveBeenCalledWith('Error deleting product:', error);

      loggerSpy.mockRestore();
    });
  });
});
