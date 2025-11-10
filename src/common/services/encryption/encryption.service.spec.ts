import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual(password);
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toEqual(hash2);
    });

    it('should handle empty string password', async () => {
      const password = '';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await service.hashPassword(password);
      const isValid = await service.comparePassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await service.hashPassword(password);
      const isValid = await service.comparePassword(
        wrongPassword,
        hashedPassword,
      );

      expect(isValid).toBe(false);
    });

    it('should return false for empty password against hash', async () => {
      const password = 'testPassword123';
      const hashedPassword = await service.hashPassword(password);
      const isValid = await service.comparePassword('', hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should handle case sensitivity', async () => {
      const password = 'TestPassword123';
      const hashedPassword = await service.hashPassword(password);
      const isValid = await service.comparePassword(
        'testpassword123',
        hashedPassword,
      );

      expect(isValid).toBe(false);
    });
  });

  describe('Service initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Integration tests', () => {
    it('should handle complete password flow', async () => {
      const originalPassword = 'mySecurePassword123!';

      const hashedPassword = await service.hashPassword(originalPassword);
      expect(hashedPassword).toBeDefined();

      const isCorrect = await service.comparePassword(
        originalPassword,
        hashedPassword,
      );
      expect(isCorrect).toBe(true);

      const isIncorrect = await service.comparePassword(
        'wrongPassword',
        hashedPassword,
      );
      expect(isIncorrect).toBe(false);
    });

    it('should handle special characters in passwords', async () => {
      const specialPassword = 'pÁ$$w0rd!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hashedPassword = await service.hashPassword(specialPassword);
      const isValid = await service.comparePassword(
        specialPassword,
        hashedPassword,
      );

      expect(isValid).toBe(true);
    });
  });
});
