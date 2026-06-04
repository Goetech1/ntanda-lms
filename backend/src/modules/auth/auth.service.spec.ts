import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2');

const mockPrismaService = {
  client: {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    role: {
      findFirst: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    }
  }
};

const mockJwtService = {
  sign: jest.fn(() => 'mock-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.client.user.findFirst.mockResolvedValue(null);
      await expect(service.login({ email: 'test@test.com', password: 'password' }, 'tenant-123')).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens if login is successful', async () => {
      const mockUser = { 
        id: 'user-1', 
        email: 'test@test.com', 
        passwordHash: 'hash', 
        role: { name: 'STUDENT', permissions: [] }, 
        tenantId: 'tenant-123', 
        fullName: 'Test User' 
      };
      mockPrismaService.client.user.findFirst.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('refresh-token-hash');
      mockPrismaService.client.refreshToken.create.mockResolvedValue({ id: 'rt-1' });

      const result = await service.login({ email: 'test@test.com', password: 'password' }, 'tenant-123');
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.refresh_token).toBeDefined();
      expect(result.user.id).toBe('user-1');
    });
  });

  describe('register', () => {
    it('should throw ConflictException if email exists', async () => {
      mockPrismaService.client.user.findFirst.mockResolvedValue({ id: '1' });
      await expect(service.register({ 
        email: 'test@test.com', password: 'Password123!', firstName: 'Test', lastName: 'User' 
      }, 'tenant-123')).rejects.toThrow(ConflictException);
    });

    it('should create a user successfully', async () => {
      mockPrismaService.client.user.findFirst.mockResolvedValue(null);
      mockPrismaService.client.role.findFirst.mockResolvedValue({ id: 'role-1', name: 'STUDENT', isSystem: true });
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockPrismaService.client.user.create.mockResolvedValue({
        id: 'user-1', email: 'test@test.com', role: { name: 'STUDENT' }
      });

      const result = await service.register({ 
        email: 'test@test.com', password: 'Password123!', firstName: 'Test', lastName: 'User' 
      }, 'tenant-123');

      expect(result.user.id).toBe('user-1');
    });
  });

  describe('refreshWithUserId', () => {
    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockPrismaService.client.refreshToken.findMany.mockResolvedValue([{ id: 'rt-1', tokenHash: 'hash' }]);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.refreshWithUserId('user-1', 'invalid-token')).rejects.toThrow(UnauthorizedException);
    });
  });
});
