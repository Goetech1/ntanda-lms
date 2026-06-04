"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionModule = void 0;
const common_1 = require("@nestjs/common");
const institution_service_1 = require("./institution.service");
const department_service_1 = require("./department.service");
const academic_session_service_1 = require("./academic-session.service");
const institution_controller_1 = require("./controllers/institution.controller");
const department_controller_1 = require("./controllers/department.controller");
const academic_session_controller_1 = require("./controllers/academic-session.controller");
let InstitutionModule = class InstitutionModule {
};
exports.InstitutionModule = InstitutionModule;
exports.InstitutionModule = InstitutionModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            institution_controller_1.InstitutionController,
            department_controller_1.DepartmentController,
            academic_session_controller_1.AcademicSessionController,
        ],
        providers: [
            institution_service_1.InstitutionService,
            department_service_1.DepartmentService,
            academic_session_service_1.AcademicSessionService,
        ],
        exports: [
            institution_service_1.InstitutionService,
            department_service_1.DepartmentService,
            academic_session_service_1.AcademicSessionService,
        ],
    })
], InstitutionModule);
//# sourceMappingURL=institution.module.js.map