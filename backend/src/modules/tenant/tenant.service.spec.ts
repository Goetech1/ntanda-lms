import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ConflictException } from '@nestjs/common';

describe('TenantService', () => {
  let service: TenantService;

  const mockPrismaService = {
    client: {
      tenant: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tenant', async () => {
      mockPrismaService.client.tenant.findFirst.mockResolvedValue(null);
      mockPrismaService.client.tenant.create.mockResolvedValue({ id: '1', name: 'Test' });

      const result = await service.create({
        name: 'Test Tenant',
        domain: 'test.com',
        subdomain: 'test',
      });

      expect(result).toEqual({ id: '1', name: 'Test' });
    });

    it('should throw ConflictException if domain/subdomain exists', async () => {
      mockPrismaService.client.tenant.findFirst.mockResolvedValue({ id: '1' });

      await expect(
        service.create({
          name: 'Test Tenant',
          domain: 'test.com',
          subdomain: 'test',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
