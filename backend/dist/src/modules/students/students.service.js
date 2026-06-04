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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const argon2 = require("argon2");
let StudentsService = class StudentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStudentDto, tenantId) {
        const existing = await this.prisma.client.user.findFirst({
            where: { email: createStudentDto.email, tenantId },
        });
        if (existing) {
            throw new common_1.ConflictException('A user with this email already exists in your institution');
        }
        const studentRole = await this.prisma.client.role.findFirst({
            where: { name: 'student', tenantId: null },
        });
        if (!studentRole) {
            throw new common_1.NotFoundException('System student role not found');
        }
        const passwordHash = await argon2.hash(createStudentDto.password || 'password123');
        return this.prisma.client.user.create({
            data: {
                tenantId,
                email: createStudentDto.email,
                passwordHash,
                fullName: createStudentDto.fullName,
                roleId: studentRole.id,
                studentProfile: {
                    create: {
                        tenantId,
                        studentIdString: createStudentDto.studentIdString,
                        dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : null,
                        address: createStudentDto.address,
                        emergencyContact: createStudentDto.emergencyContact || {},
                    }
                }
            },
            include: {
                studentProfile: true,
            }
        });
    }
    async findAll(tenantId) {
        const studentRole = await this.prisma.client.role.findFirst({
            where: { name: 'student', tenantId: null },
        });
        const users = await this.prisma.client.user.findMany({
            where: { tenantId, roleId: studentRole?.id },
            include: {
                studentProfile: true,
            },
        });
        return users.map(u => {
            const { passwordHash, ...safeUser } = u;
            return safeUser;
        });
    }
    async findOne(id, tenantId) {
        const user = await this.prisma.client.user.findFirst({
            where: { id, tenantId },
            include: {
                studentProfile: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Student not found');
        }
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
    async update(id, updateStudentDto, tenantId) {
        const user = await this.findOne(id, tenantId);
        const dataToUpdate = {
            fullName: updateStudentDto.fullName,
        };
        let profileUpdate = undefined;
        if (updateStudentDto.studentIdString || updateStudentDto.dateOfBirth || updateStudentDto.address || updateStudentDto.emergencyContact) {
            profileUpdate = {
                upsert: {
                    create: {
                        tenantId,
                        studentIdString: updateStudentDto.studentIdString,
                        dateOfBirth: updateStudentDto.dateOfBirth ? new Date(updateStudentDto.dateOfBirth) : null,
                        address: updateStudentDto.address,
                        emergencyContact: updateStudentDto.emergencyContact,
                    },
                    update: {
                        studentIdString: updateStudentDto.studentIdString,
                        dateOfBirth: updateStudentDto.dateOfBirth ? new Date(updateStudentDto.dateOfBirth) : undefined,
                        address: updateStudentDto.address,
                        emergencyContact: updateStudentDto.emergencyContact,
                    }
                }
            };
            dataToUpdate.studentProfile = profileUpdate;
        }
        const updated = await this.prisma.client.user.update({
            where: { id },
            data: dataToUpdate,
            include: {
                studentProfile: true,
            }
        });
        const { passwordHash, ...safeUser } = updated;
        return safeUser;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map