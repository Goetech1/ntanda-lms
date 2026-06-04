import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, Req, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /api/v1/notifications
   * Returns paginated in-app notifications for the authenticated user.
   * Query: ?page=1&limit=20
   */
  @Get()
  getNotifications(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.notificationsService.getNotifications(req.tenantId, req.user.id, page, limit);
  }

  /**
   * GET /api/v1/notifications/unread-count
   * Returns the unread notification count for the badge.
   */
  @Get('unread-count')
  getUnreadCount(@Req() req: any) {
    return this.notificationsService.getUnreadCount(req.tenantId, req.user.id);
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   * Marks a specific notification as read.
   */
  @Patch(':id/read')
  markAsRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.tenantId, req.user.id, id);
  }

  /**
   * PATCH /api/v1/notifications/read-all
   * Marks ALL notifications as read for the current user.
   */
  @Patch('read-all')
  markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.tenantId, req.user.id);
  }

  /**
   * DELETE /api/v1/notifications/:id
   * Deletes a specific notification.
   */
  @Delete(':id')
  deleteNotification(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(req.tenantId, req.user.id, id);
  }

  /**
   * POST /api/v1/notifications/send
   * Admin endpoint — send a targeted notification to a specific user.
   */
  @Post('send')
  sendNotification(
    @Req() req: any,
    @Body() body: {
      userId: string;
      title: string;
      message: string;
      channels?: string[];
      email?: string;
      phone?: string;
      metadata?: Record<string, any>;
    },
  ) {
    return this.notificationsService.send({
      tenantId: req.tenantId,
      userId: body.userId,
      title: body.title,
      message: body.message,
      channels: body.channels as any,
      email: body.email,
      phone: body.phone,
      metadata: body.metadata,
    });
  }

  /**
   * POST /api/v1/notifications/broadcast
   * Admin endpoint — broadcast to ALL users in the current tenant.
   */
  @Post('broadcast')
  broadcastNotification(
    @Req() req: any,
    @Body() body: { title: string; message: string; metadata?: Record<string, any> },
  ) {
    return this.notificationsService.broadcast(req.tenantId, body.title, body.message, body.metadata);
  }

  @Post('push')
  sendPushNotification(@Req() req: any, @Body() body: any) {
    return this.notificationsService.sendPush(req.tenantId, body);
  }

  @Post('whatsapp')
  sendWhatsappNotification(@Req() req: any, @Body() body: any) {
    return this.notificationsService.sendWhatsapp(req.tenantId, body);
  }
}

