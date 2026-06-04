"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tenant_controller_1 = require("./tenant.controller");
const tenant_service_1 = require("./tenant.service");
describe('TenantController', () => {
    let controller;
    let service;
    const mockTenantService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [tenant_controller_1.TenantController],
            providers: [
                {
                    provide: tenant_service_1.TenantService,
                    useValue: mockTenantService,
                },
            ],
        }).compile();
        controller = module.get(tenant_controller_1.TenantController);
        service = module.get(tenant_service_1.TenantService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call findAll', async () => {
        mockTenantService.findAll.mockResolvedValue([]);
        await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
    });
});
//# sourceMappingURL=tenant.controller.spec.js.map