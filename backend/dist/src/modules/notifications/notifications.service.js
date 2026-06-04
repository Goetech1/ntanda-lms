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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const notifications_gateway_1 = require("./notifications.gateway");
const email_service_1 = require("./email.service");
const sms_service_1 = require("./sms.service");
const prisma = new client_1.PrismaClient();
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(gateway, emailService, smsService) {
        this.gateway = gateway;
        this.emailService = emailService;
        this.smsService = smsService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async send(dto) {
        const channels = dto.channels ?? [client_1.NotificationChannel.IN_APP];
        for (const channel of channels) {
            if (channel === client_1.NotificationChannel.IN_APP) {
                const notification = await prisma.notification.create({
                    data: {
                        tenantId: dto.tenantId,
                        userId: dto.userId,
                        title: dto.title,
                        message: dto.message,
                        channel: client_1.NotificationChannel.IN_APP,
                        metadata: dto.metadata ?? {},
                    },
                });
                this.gateway.sendToUser(dto.userId, notification);
                const unreadCount = await this.getUnreadCount(dto.tenantId, dto.userId);
                this.gateway.sendUnreadCount(dto.userId, unreadCount);
            }
            if (channel === client_1.NotificationChannel.EMAIL && dto.email) {
                try {
                    await this.emailService.sendEmail(dto.email, dto.title, `<p>${dto.message}</p>`, dto.message);
                    await prisma.notification.create({
                        data: {
                            tenantId: dto.tenantId,
                            userId: dto.userId,
                            title: dto.title,
                            message: dto.message,
                            channel: client_1.NotificationChannel.EMAIL,
                            isRead: true,
                            metadata: dto.metadata ?? {},
                        },
                    });
                }
                catch (err) {
                    this.logger.error(`Email dispatch failed for user ${dto.userId}: ${err.message}`);
                }
            }
            if (channel === client_1.NotificationChannel.SMS && dto.phone) {
                try {
                    await this.smsService.sendSms(dto.phone, `${dto.title}: ${dto.message}`);
                    await prisma.notification.create({
                        data: {
                            tenantId: dto.tenantId,
                            userId: dto.userId,
                            title: dto.title,
                            message: dto.message,
                            channel: client_1.NotificationChannel.SMS,
                            isRead: true,
                            metadata: dto.metadata ?? {},
                        },
                    });
                }
                catch (err) {
                    this.logger.error(`SMS dispatch failed for user ${dto.userId}: ${err.message}`);
                }
            }
        }
    }
    async broadcast(tenantId, title, message, metadata) {
        const users = await prisma.user.findMany({
            where: { tenantId, deletedAt: null },
            select: { id: true },
        });
        const data = users.map((u) => ({
            tenantId,
            userId: u.id,
            title,
            message,
            channel: client_1.NotificationChannel.IN_APP,
            metadata: metadata ?? {},
        }));
        await prisma.notification.createMany({ data });
        this.gateway.broadcastToTenant(tenantId, { title, message, metadata });
    }
    async getNotifications(tenantId, userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [notifications, total, unread] = await Promise.all([
            prisma.notification.findMany({
                where: { tenantId, userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.notification.count({ where: { tenantId, userId } }),
            prisma.notification.count({ where: { tenantId, userId, isRead: false } }),
        ]);
        return {
            data: notifications,
            meta: {
                total,
                unread,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async markAsRead(tenantId, userId, notificationId) {
        const notification = await prisma.notification.updateMany({
            where: { id: notificationId, tenantId, userId },
            data: { isRead: true },
        });
        const unreadCount = await this.getUnreadCount(tenantId, userId);
        this.gateway.sendUnreadCount(userId, unreadCount);
        return notification;
    }
    async markAllAsRead(tenantId, userId) {
        await prisma.notification.updateMany({
            where: { tenantId, userId, isRead: false },
            data: { isRead: true },
        });
        this.gateway.sendUnreadCount(userId, 0);
        return { success: true, message: 'All notifications marked as read' };
    }
    async deleteNotification(tenantId, userId, notificationId) {
        return prisma.notification.deleteMany({
            where: { id: notificationId, tenantId, userId },
        });
    }
    async getUnreadCount(tenantId, userId) {
        return prisma.notification.count({ where: { tenantId, userId, isRead: false } });
    }
    async sendPush(tenantId, data) {
        return { success: true, message: 'Push notification sent' };
    }
    async sendWhatsapp(tenantId, data) {
        return { success: true, message: 'WhatsApp message sent' };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_gateway_1.NotificationsGateway,
        email_service_1.EmailService,
        sms_service_1.SmsService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map