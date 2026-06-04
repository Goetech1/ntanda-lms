import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: any, page: number, limit: number): Promise<{
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
    getUnreadCount(req: any): Promise<number>;
    markAsRead(req: any, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteNotification(req: any, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    sendNotification(req: any, body: {
        userId: string;
        title: string;
        message: string;
        channels?: string[];
        email?: string;
        phone?: string;
        metadata?: Record<string, any>;
    }): Promise<void>;
    broadcastNotification(req: any, body: {
        title: string;
        message: string;
        metadata?: Record<string, any>;
    }): Promise<void>;
    sendPushNotification(req: any, body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    sendWhatsappNotification(req: any, body: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
