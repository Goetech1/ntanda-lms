import { NotificationChannel } from '@prisma/client';
import { NotificationsGateway } from './notifications.gateway';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
export interface SendNotificationDto {
    tenantId: string;
    userId: string;
    title: string;
    message: string;
    channels?: NotificationChannel[];
    metadata?: Record<string, any>;
    email?: string;
    phone?: string;
}
export declare class NotificationsService {
    private readonly gateway;
    private readonly emailService;
    private readonly smsService;
    private readonly logger;
    constructor(gateway: NotificationsGateway, emailService: EmailService, smsService: SmsService);
    send(dto: SendNotificationDto): Promise<void>;
    broadcast(tenantId: string, title: string, message: string, metadata?: Record<string, any>): Promise<void>;
    getNotifications(tenantId: string, userId: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            tenantId: string;
            userId: string;
            title: string;
            message: string;
            channel: import(".prisma/client").$Enums.NotificationChannel;
            isRead: boolean;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        meta: {
            total: number;
            unread: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    markAsRead(tenantId: string, userId: string, notificationId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(tenantId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteNotification(tenantId: string, userId: string, notificationId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnreadCount(tenantId: string, userId: string): Promise<number>;
    sendPush(tenantId: string, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
    sendWhatsapp(tenantId: string, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
