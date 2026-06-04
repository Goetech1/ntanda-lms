"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualClassroomService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const zoom_integration_service_1 = require("./services/zoom-integration.service");
let VirtualClassroomService = class VirtualClassroomService {
    constructor(prisma, zoomService) {
        this.prisma = prisma;
        this.zoomService = zoomService;
    }
    async scheduleClass(tenantId, instructorId, data) {
        const { title, description, courseId, provider, scheduledAt, durationMinutes } = data;
        if (courseId) {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId, tenantId },
            });
            if (!course)
                throw new common_1.NotFoundException('Course not found');
        }
        let meetingDetails = { meetingId: null, joinUrl: null, meetingUrl: null };
        if (provider === 'ZOOM') {
            meetingDetails = await this.zoomService.createMeeting(tenantId, instructorId, title, durationMinutes);
        }
        const virtualClass = await this.prisma.virtualClass.create({
            data: {
                tenantId,
                instructorId,
                courseId,
                title,
                description,
                provider,
                scheduledAt: new Date(scheduledAt),
                durationMinutes,
                meetingId: meetingDetails.meetingId,
                joinUrl: meetingDetails.joinUrl,
                meetingUrl: meetingDetails.meetingUrl,
            },
        });
        return virtualClass;
    }
    async listClasses(tenantId, courseId) {
        return this.prisma.virtualClass.findMany({
            where: {
                tenantId,
                ...(courseId ? { courseId } : {}),
            },
            orderBy: { scheduledAt: 'asc' },
        });
    }
    async registerForWebinar(tenantId, virtualClassId, email, fullName, userId) {
        const vClass = await this.prisma.virtualClass.findUnique({
            where: { id: virtualClassId, tenantId },
        });
        if (!vClass)
            throw new common_1.NotFoundException('Virtual class not found');
        return this.prisma.webinarRegistration.create({
            data: {
                tenantId,
                virtualClassId,
                email,
                fullName,
                userId,
            },
        });
    }
};
exports.VirtualClassroomService = VirtualClassroomService;
exports.VirtualClassroomService = VirtualClassroomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        zoom_integration_service_1.ZoomIntegrationService])
], VirtualClassroomService);
//# sourceMappingURL=virtual-classroom.service.js.map