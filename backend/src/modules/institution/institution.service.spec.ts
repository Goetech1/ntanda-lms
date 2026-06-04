import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionService } from './institution.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';

describe('InstitutionService', () => {
  let service: InstitutionService;

  const mockPrismaService = {
    client: {
      institution: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      tenant: {
        findUnique: jest.fn(),
      },
    },
  };

  const mockTenantStorage = {
    getStore: jest.fn().mockReturnValue('tenant-1'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstitutionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: 'TENANT_STORAGE',
          useValue: mockTenantStorage,
        },
      ],
    }).compile();

    service = module.get<InstitutionService>(InstitutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
