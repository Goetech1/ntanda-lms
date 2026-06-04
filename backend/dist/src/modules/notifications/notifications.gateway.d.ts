import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private userSockets;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    sendToUser(userId: string, notification: any): void;
    broadcastToTenant(tenantId: string, notification: any): void;
    sendUnreadCount(userId: string, count: number): void;
    handleMarkRead(client: Socket, data: {
        notificationId: string;
    }): void;
}
