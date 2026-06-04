"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tenant_service_1 = require("./tenant.service");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const common_1 = require("@nestjs/common");
describe('TenantService', () => {
    let service;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                tenant_service_1.TenantService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(tenant_service_1.TenantService);
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
            await expect(service.create({
                name: 'Test Tenant',
                domain: 'test.com',
                subdomain: 'test',
            })).rejects.toThrow(common_1.ConflictException);
        });
    });
});
//# sourceMappingURL=tenant.service.spec.js.map