"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const subscriptions_service_1 = require("./subscriptions.service");
describe('SubscriptionsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [subscriptions_service_1.SubscriptionsService],
        }).compile();
        service = module.get(subscriptions_service_1.SubscriptionsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=subscriptions.service.spec.js.map