"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const institution_service_1 = require("./institution.service");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
describe('InstitutionService', () => {
    let service;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                institution_service_1.InstitutionService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: 'TENANT_STORAGE',
                    useValue: mockTenantStorage,
                },
            ],
        }).compile();
        service = module.get(institution_service_1.InstitutionService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=institution.service.spec.js.map