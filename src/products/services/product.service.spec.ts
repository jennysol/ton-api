import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductsRepository } from '../repositories/product.repository';
import { IProduct, IPaginatedProducts } from '../interfaces/product.interface';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let productsRepository: jest.Mocked<ProductsRepository>;

  const mockProduct: IProduct = {
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

  const mockUpdateProductDto: UpdateProductDto = {
    title: 'Updated Product',
    price: 299.99,
  };

  const mockPaginatedProducts: IPaginatedProducts = {
    products: [mockProduct],
    nextKey: 'next-cursor',
  };

  beforeEach(async () => {
    const mockProductsRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productsRepository = module.get<ProductsRepository>(
      ProductsRepository,
    ) as jest.Mocked<ProductsRepository>;

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      const productId = 'product-id';
      productsRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.findById(productId);

      expect(result).toEqual(mockProduct);
      expect(productsRepository.findById).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException when product not found', async () => {
      const productId = 'nonexistent-id';
      const error = new Error('Product with ID nonexistent-id not found');
      productsRepository.findById.mockRejectedValue(error);

      await expect(service.findById(productId)).rejects.toThrow(
        'Product with ID nonexistent-id not found',
      );
      expect(productsRepository.findById).toHaveBeenCalledWith(productId);
    });

    it('should throw error when repository throws error', async () => {
      const productId = 'product-id';
      const error = new Error('Repository error');
      productsRepository.findById.mockRejectedValue(error);

      await expect(service.findById(productId)).rejects.toThrow(
        'Repository error',
      );
      expect(productsRepository.findById).toHaveBeenCalledWith(productId);
    });
  });

  describe('findAll', () => {
    it('should return paginated products without nextKey', async () => {
      const limit = 10;
      productsRepository.findAll.mockResolvedValue(mockPaginatedProducts);

      const result = await service.findAll(limit);

      expect(result).toEqual(mockPaginatedProducts);
      expect(productsRepository.findAll).toHaveBeenCalledWith(limit, undefined);
    });

    it('should return paginated products with nextKey', async () => {
      const limit = 5;
      const nextKey = 'existing-cursor';
      productsRepository.findAll.mockResolvedValue(mockPaginatedProducts);

      const result = await service.findAll(limit, nextKey);

      expect(result).toEqual(mockPaginatedProducts);
      expect(productsRepository.findAll).toHaveBeenCalledWith(limit, nextKey);
    });

    it('should return empty products array when no products found', async () => {
      const limit = 10;
      const emptyResult: IPaginatedProducts = {
        products: [],
        nextKey: null,
      };
      productsRepository.findAll.mockResolvedValue(emptyResult);

      const result = await service.findAll(limit);

      expect(result).toEqual(emptyResult);
      expect(productsRepository.findAll).toHaveBeenCalledWith(limit, undefined);
    });

    it('should throw error when repository throws error', async () => {
      const limit = 10;
      const error = new Error('Repository error');
      productsRepository.findAll.mockRejectedValue(error);

      await expect(service.findAll(limit)).rejects.toThrow('Repository error');
      expect(productsRepository.findAll).toHaveBeenCalledWith(limit, undefined);
    });
  });

  describe('create', () => {
    it('should create and return new product', async () => {
      const expectedProduct = {
        ...mockCreateProductDto,
        productId: 'new-product-id',
      };
      productsRepository.create.mockResolvedValue(expectedProduct);

      const result = await service.create(mockCreateProductDto);

      expect(result).toEqual(expectedProduct);
      expect(productsRepository.create).toHaveBeenCalledWith(
        mockCreateProductDto,
      );
    });

    it('should throw error when repository throws error', async () => {
      const error = new Error('Creation failed');
      productsRepository.create.mockRejectedValue(error);

      await expect(service.create(mockCreateProductDto)).rejects.toThrow(
        'Creation failed',
      );
      expect(productsRepository.create).toHaveBeenCalledWith(
        mockCreateProductDto,
      );
    });
  });

  describe('update', () => {
    it('should update and return product', async () => {
      const productId = 'product-id';
      const updatedProduct = { ...mockProduct, ...mockUpdateProductDto };
      productsRepository.update.mockResolvedValue(updatedProduct);

      const result = await service.update(productId, mockUpdateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(productsRepository.update).toHaveBeenCalledWith(
        productId,
        mockUpdateProductDto,
      );
    });

    it('should throw NotFoundException when product not found for update', async () => {
      const productId = 'nonexistent-id';
      const error = new Error('Product with ID nonexistent-id not found');
      productsRepository.update.mockRejectedValue(error);

      await expect(
        service.update(productId, mockUpdateProductDto),
      ).rejects.toThrow('Product with ID nonexistent-id not found');
      expect(productsRepository.update).toHaveBeenCalledWith(
        productId,
        mockUpdateProductDto,
      );
    });

    it('should throw error when repository throws error', async () => {
      const productId = 'product-id';
      const error = new Error('Update failed');
      productsRepository.update.mockRejectedValue(error);

      await expect(
        service.update(productId, mockUpdateProductDto),
      ).rejects.toThrow('Update failed');
      expect(productsRepository.update).toHaveBeenCalledWith(
        productId,
        mockUpdateProductDto,
      );
    });

    it('should handle partial updates correctly', async () => {
      const productId = 'product-id';
      const partialUpdate: UpdateProductDto = { price: 399.99 };
      const updatedProduct = { ...mockProduct, price: 399.99 };
      productsRepository.update.mockResolvedValue(updatedProduct);

      const result = await service.update(productId, partialUpdate);

      expect(result).toEqual(updatedProduct);
      expect(productsRepository.update).toHaveBeenCalledWith(
        productId,
        partialUpdate,
      );
    });

    it('should handle multiple field updates correctly', async () => {
      const productId = 'product-id';
      const multipleFieldUpdate: UpdateProductDto = {
        title: 'New Title',
        description: 'New Description',
        price: 499.99,
      };
      const updatedProduct = { ...mockProduct, ...multipleFieldUpdate };
      productsRepository.update.mockResolvedValue(updatedProduct);

      const result = await service.update(productId, multipleFieldUpdate);

      expect(result).toEqual(updatedProduct);
      expect(productsRepository.update).toHaveBeenCalledWith(
        productId,
        multipleFieldUpdate,
      );
    });
  });

  describe('delete', () => {
    it('should delete product successfully', async () => {
      const productId = 'product-id';
      productsRepository.delete.mockResolvedValue(undefined);

      await service.delete(productId);

      expect(productsRepository.delete).toHaveBeenCalledWith(productId);
    });

    it('should throw error when repository throws error', async () => {
      const productId = 'product-id';
      const error = new Error('Delete failed');
      productsRepository.delete.mockRejectedValue(error);

      await expect(service.delete(productId)).rejects.toThrow('Delete failed');
      expect(productsRepository.delete).toHaveBeenCalledWith(productId);
    });
  });

  describe('Service initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have products repository injected', () => {
      expect(service['productsRepository']).toBeDefined();
      expect(service['productsRepository']).toBe(productsRepository);
    });
  });
});
