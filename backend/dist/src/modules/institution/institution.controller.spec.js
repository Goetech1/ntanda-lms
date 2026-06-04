"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const institution_controller_1 = require("./controllers/institution.controller");
const institution_service_1 = require("./institution.service");
describe('InstitutionController', () => {
    let controller;
    const mockInstitutionService = {
        getCurrentInstitution: jest.fn(),
        updateCurrentInstitution: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [institution_controller_1.InstitutionController],
            providers: [
                {
                    provide: institution_service_1.InstitutionService,
                    useValue: mockInstitutionService,
                },
            ],
        }).compile();
        controller = module.get(institution_controller_1.InstitutionController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=institution.controller.spec.js.map