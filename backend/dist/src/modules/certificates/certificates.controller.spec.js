"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const certificates_controller_1 = require("./certificates.controller");
describe('CertificatesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [certificates_controller_1.CertificatesController],
        }).compile();
        controller = module.get(certificates_controller_1.CertificatesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=certificates.controller.spec.js.map