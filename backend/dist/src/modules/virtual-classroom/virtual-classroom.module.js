"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualClassroomModule = void 0;
const common_1 = require("@nestjs/common");
const virtual_classroom_controller_1 = require("./virtual-classroom.controller");
const virtual_classroom_service_1 = require("./virtual-classroom.service");
const zoom_integration_service_1 = require("./services/zoom-integration.service");
const google_meet_integration_service_1 = require("./services/google-meet-integration.service");
const ms_teams_integration_service_1 = require("./services/ms-teams-integration.service");
let VirtualClassroomModule = class VirtualClassroomModule {
};
exports.VirtualClassroomModule = VirtualClassroomModule;
exports.VirtualClassroomModule = VirtualClassroomModule = __decorate([
    (0, common_1.Module)({
        controllers: [virtual_classroom_controller_1.VirtualClassroomController],
        providers: [
            virtual_classroom_service_1.VirtualClassroomService,
            zoom_integration_service_1.ZoomIntegrationService,
            google_meet_integration_service_1.GoogleMeetIntegrationService,
            ms_teams_integration_service_1.MsTeamsIntegrationService,
        ],
        exports: [virtual_classroom_service_1.VirtualClassroomService],
    })
], VirtualClassroomModule);
//# sourceMappingURL=virtual-classroom.module.js.map