import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, NotificationChannel } from '@prisma/client';
import { NotificationsGateway } from './notifications.gateway';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

const prisma = new PrismaClient();

export interface SendNotificationDto {
  tenantId: string;
  userId: string;
  title: string;
  message: string;
  channels?: NotificationChannel[];
  metadata?: Record<string, any>;
  // For email/SMS delivery
  email?: string;
  phone?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly gateway: NotificationsGateway,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  /**
   * Core method — creates a Notification record and dispatches across configured channels
   */
  async send(dto: SendNotificationDto): Promise<void> {
    const channels = dto.channels ?? [NotificationChannel.IN_APP];

    for (const channel of channels) {
      // Persist in-app notification to DB
      if (channel === NotificationChannel.IN_APP) {
        const notification = await prisma.notification.create({
          data: {
            tenantId: dto.tenantId,
            userId: dto.userId,
            title: dto.title,
            message: dto.message,
            channel: NotificationChannel.IN_APP,
            metadata: dto.metadata ?? {},
          },
        });

        // Push realtime via WebSocket
        this.gateway.sendToUser(dto.userId, notification);

        // Update unread count
        const unreadCount = await this.getUnreadCount(dto.tenantId, dto.userId);
        this.gateway.sendUnreadCount(dto.userId, unreadCount);
      }

      // Email channel
      if (channel === NotificationChannel.EMAIL && dto.email) {
        try {
          await this.emailService.sendEmail(dto.email, dto.title, `<p>${dto.message}</p>`, dto.message);
          await prisma.notification.create({
            data: {
              tenantId: dto.tenantId,
              userId: dto.userId,
              title: dto.title,
              message: dto.message,
              channel: NotificationChannel.EMAIL,
              isRead: true, // Email doesn't have a read state in-app
              metadata: dto.metadata ?? {},
            },
          });
        } catch (err) {
          this.logger.error(`Email dispatch failed for user ${dto.userId}: ${err.message}`);
        }
      }

      // SMS channel
      if (channel === NotificationChannel.SMS && dto.phone) {
        try {
          await this.smsService.sendSms(dto.phone, `${dto.title}: ${dto.message}`);
          await prisma.notification.create({
            data: {
              tenantId: dto.tenantId,
              userId: dto.userId,
              title: dto.title,
              message: dto.message,
              channel: NotificationChannel.SMS,
              isRead: true, // SMS doesn't have read state in-app
              metadata: dto.metadata ?? {},
            },
          });
        } catch (err) {
          this.logger.error(`SMS dispatch failed for user ${dto.userId}: ${err.message}`);
        }
      }
    }
  }

  /**
   * Bulk broadcast to all users in a tenant
   */
  async broadcast(tenantId: string, title: string, message: string, metadata?: Record<string, any>): Promise<void> {
    const users = await prisma.user.findMany({
      where: { tenantId, deletedAt: null },
      select: { id: true },
    });

    const data = users.map((u) => ({
      tenantId,
      userId: u.id,
      title,
      message,
      channel: NotificationChannel.IN_APP,
      metadata: metadata ?? {},
    }));

    await prisma.notification.createMany({ data });
    this.gateway.broadcastToTenant(tenantId, { title, message, metadata });
  }

  // ─── CRUD for in-app notifications ────────────────────────────────────────

  async getNotifications(tenantId: string, userId: string, page = 1, limit = 20) {
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

  async markAsRead(tenantId: string, userId: string, notificationId: string) {
    const notification = await prisma.notification.updateMany({
      where: { id: notificationId, tenantId, userId },
      data: { isRead: true },
    });

    // Push updated count via WebSocket
    const unreadCount = await this.getUnreadCount(tenantId, userId);
    this.gateway.sendUnreadCount(userId, unreadCount);

    return notification;
  }

  async markAllAsRead(tenantId: string, userId: string) {
    await prisma.notification.updateMany({
      where: { tenantId, userId, isRead: false },
      data: { isRead: true },
    });

    this.gateway.sendUnreadCount(userId, 0);
    return { success: true, message: 'All notifications marked as read' };
  }

  async deleteNotification(tenantId: string, userId: string, notificationId: string) {
    return prisma.notification.deleteMany({
      where: { id: notificationId, tenantId, userId },
    });
  }

  async getUnreadCount(tenantId: string, userId: string): Promise<number> {
    return prisma.notification.count({ where: { tenantId, userId, isRead: false } });
  }

  async sendPush(tenantId: string, data: any) {
    // Mock implementation
    return { success: true, message: 'Push notification sent' };
  }

  async sendWhatsapp(tenantId: string, data: any) {
    // Mock implementation
    return { success: true, message: 'WhatsApp message sent' };
  }
}

