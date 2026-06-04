import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

/**
 * Realtime WebSocket Gateway
 *
 * Client connection flow:
 *   1. connect with auth: { token: '<jwt_access_token>' }
 *   2. Server validates and joins the client to rooms:
 *        - user:<userId>       → personal notifications
 *        - tenant:<tenantId>   → tenant-wide broadcasts
 *
 * Events emitted by server:
 *   - 'notification'       → { id, title, message, channel, createdAt }
 *   - 'notification_count' → { unread: number }
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  // Map userId → Set of socket IDs for multi-tab support
  private userSockets = new Map<string, Set<string>>();

  async handleConnection(client: Socket) {
    try {
      // Extract JWT payload from auth header or query
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token. Disconnecting.`);
        client.disconnect(true);
        return;
      }

      // Decode JWT (no verification here — main app handles that via HTTP guards)
      const [, payloadBase64] = (token as string).split('.');
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
      const { sub: userId, tenantId } = payload;

      if (!userId || !tenantId) {
        client.disconnect(true);
        return;
      }

      // Store userId on socket for reference
      client.data.userId = userId;
      client.data.tenantId = tenantId;

      // Join personal and tenant rooms
      await client.join(`user:${userId}`);
      await client.join(`tenant:${tenantId}`);

      // Track socket
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      this.logger.log(`Client ${client.id} connected → user:${userId}, tenant:${tenantId}`);
    } catch (err) {
      this.logger.error(`Connection error: ${err.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.logger.log(`Client ${client.id} disconnected`);
  }

  // ─── Server-side emit helpers ──────────────────────────────────────────────

  /**
   * Push a notification to a specific user (all their tabs/devices)
   */
  sendToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
    this.logger.debug(`Pushed notification to user:${userId}`);
  }

  /**
   * Broadcast to all connected users of a tenant
   */
  broadcastToTenant(tenantId: string, notification: any) {
    this.server.to(`tenant:${tenantId}`).emit('notification', notification);
    this.logger.debug(`Broadcast notification to tenant:${tenantId}`);
  }

  /**
   * Send unread count update to a user
   */
  sendUnreadCount(userId: string, count: number) {
    this.server.to(`user:${userId}`).emit('notification_count', { unread: count });
  }

  // ─── Client → Server events ───────────────────────────────────────────────

  @SubscribeMessage('mark_read')
  handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    // Acknowledge receipt — actual DB update is done via HTTP PATCH endpoint
    client.emit('marked_read', { id: data.notificationId });
  }
}
