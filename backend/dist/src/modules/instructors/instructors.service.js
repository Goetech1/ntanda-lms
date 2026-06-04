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
exports.InstructorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const argon2 = require("argon2");
let InstructorsService = class InstructorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const existing = await this.prisma.client.user.findFirst({
            where: { email: dto.email, tenantId },
        });
        if (existing)
            throw new common_1.ConflictException('User with this email already exists');
        const instructorRole = await this.prisma.client.role.findFirst({
            where: { name: 'instructor', tenantId: null },
        });
        if (!instructorRole)
            throw new common_1.NotFoundException('Instructor role not found');
        const passwordHash = await argon2.hash(dto.password || 'password123');
        const user = await this.prisma.client.user.create({
            data: {
                tenantId,
                email: dto.email,
                passwordHash,
                fullName: dto.fullName,
                roleId: instructorRole.id,
                instructorProfile: {
                    create: {
                        tenantId,
                        bio: dto.bio,
                        expertise: dto.expertise || [],
                        qualifications: dto.qualifications || [],
                        teachingSubjects: dto.teachingSubjects || [],
                    },
                },
            },
            include: { instructorProfile: true, role: true },
        });
        const { passwordHash: _ph, ...safe } = user;
        return safe;
    }
    async findAll(tenantId) {
        const instructorRole = await this.prisma.client.role.findFirst({
            where: { name: 'instructor', tenantId: null },
        });
        const users = await this.prisma.client.user.findMany({
            where: { tenantId, roleId: instructorRole?.id, deletedAt: null },
            include: {
                instructorProfile: true,
                courses: {
                    where: { deletedAt: null },
                    select: { id: true, title: true, status: true, _count: { select: { enrollments: true } } },
                },
            },
        });
        return users.map((u) => {
            const { passwordHash: _ph, ...safe } = u;
            return safe;
        });
    }
    async findOne(id, tenantId) {
        const user = await this.prisma.client.user.findFirst({
            where: { id, tenantId },
            include: {
                instructorProfile: true,
                courses: {
                    where: { deletedAt: null },
                    include: { _count: { select: { enrollments: true } } },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Instructor not found');
        const { passwordHash: _ph, ...safe } = user;
        return safe;
    }
    async update(id, dto, tenantId) {
        await this.findOne(id, tenantId);
        const updated = await this.prisma.client.user.update({
            where: { id },
            data: {
                fullName: dto.fullName,
                instructorProfile: {
                    upsert: {
                        create: { tenantId, bio: dto.bio, expertise: dto.expertise || [], qualifications: dto.qualifications || [], teachingSubjects: dto.teachingSubjects || [] },
                        update: { bio: dto.bio, expertise: dto.expertise, qualifications: dto.qualifications, teachingSubjects: dto.teachingSubjects },
                    },
                },
            },
            include: { instructorProfile: true },
        });
        const { passwordHash: _ph, ...safe } = updated;
        return safe;
    }
    async getPerformance(id, tenantId) {
        const instructor = await this.findOne(id, tenantId);
        const courses = instructor.courses;
        const totalCourses = courses.length;
        const publishedCourses = courses.filter((c) => c.status === 'PUBLISHED').length;
        const totalStudents = courses.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0);
        const submissions = await this.prisma.client.submission.findMany({
            where: { tenantId, assessment: { course: { instructorId: id } } },
            select: { score: true, assessment: { select: { totalPoints: true } } },
        });
        const avgScore = submissions.length > 0
            ? submissions.reduce((sum, s) => sum + ((s.score || 0) / s.assessment.totalPoints) * 100, 0) / submissions.length
            : 0;
        return { totalCourses, publishedCourses, totalStudents, avgScore: avgScore.toFixed(1) };
    }
};
exports.InstructorsService = InstructorsService;
exports.InstructorsService = InstructorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstructorsService);
//# sourceMappingURL=instructors.service.js.map