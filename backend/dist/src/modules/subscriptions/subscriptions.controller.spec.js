"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const subscriptions_controller_1 = require("./subscriptions.controller");
describe('SubscriptionsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [subscriptions_controller_1.SubscriptionsController],
        }).compile();
        controller = module.get(subscriptions_controller_1.SubscriptionsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=subscriptions.controller.spec.js.map