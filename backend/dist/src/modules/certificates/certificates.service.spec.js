"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const certificates_service_1 = require("./certificates.service");
describe('CertificatesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [certificates_service_1.CertificatesService],
        }).compile();
        service = module.get(certificates_service_1.CertificatesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=certificates.service.spec.js.map