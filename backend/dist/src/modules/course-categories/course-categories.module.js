"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const course_categories_service_1 = require("./course-categories.service");
const course_categories_controller_1 = require("./course-categories.controller");
let CourseCategoriesModule = class CourseCategoriesModule {
};
exports.CourseCategoriesModule = CourseCategoriesModule;
exports.CourseCategoriesModule = CourseCategoriesModule = __decorate([
    (0, common_1.Module)({
        controllers: [course_categories_controller_1.CourseCategoriesController],
        providers: [course_categories_service_1.CourseCategoriesService],
        exports: [course_categories_service_1.CourseCategoriesService],
    })
], CourseCategoriesModule);
//# sourceMappingURL=course-categories.module.js.map