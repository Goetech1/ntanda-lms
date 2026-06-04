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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let AttendanceService = class AttendanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markAttendance(data, tenantId) {
        const attendanceDate = new Date(data.date);
        return this.prisma.client.attendance.upsert({
            where: {
                tenantId_courseId_userId_date: {
                    tenantId,
                    courseId: data.courseId,
                    userId: data.userId,
                    date: attendanceDate,
                }
            },
            update: {
                status: data.status,
                remarks: data.remarks,
            },
            create: {
                tenantId,
                courseId: data.courseId,
                userId: data.userId,
                date: attendanceDate,
                status: data.status,
                remarks: data.remarks,
            }
        });
    }
    async getAttendanceByCourseAndDate(courseId, date, tenantId) {
        return this.prisma.client.attendance.findMany({
            where: {
                tenantId,
                courseId,
                date: new Date(date),
            },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true, studentProfile: true }
                }
            }
        });
    }
    async getStudentAttendance(userId, courseId, tenantId) {
        return this.prisma.client.attendance.findMany({
            where: {
                tenantId,
                userId,
                courseId: courseId ? courseId : undefined,
            },
            orderBy: { date: 'desc' },
            include: {
                course: { select: { title: true } }
            }
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map