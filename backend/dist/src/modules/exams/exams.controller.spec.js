"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const exams_controller_1 = require("./exams.controller");
describe('ExamsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [exams_controller_1.ExamsController],
        }).compile();
        controller = module.get(exams_controller_1.ExamsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=exams.controller.spec.js.map