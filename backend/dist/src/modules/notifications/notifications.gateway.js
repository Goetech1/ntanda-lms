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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsGateway_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    constructor() {
        this.logger = new common_1.Logger(NotificationsGateway_1.name);
        this.userSockets = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.query?.token;
            if (!token) {
                this.logger.warn(`Client ${client.id} connected without token. Disconnecting.`);
                client.disconnect(true);
                return;
            }
            const [, payloadBase64] = token.split('.');
            const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
            const { sub: userId, tenantId } = payload;
            if (!userId || !tenantId) {
                client.disconnect(true);
                return;
            }
            client.data.userId = userId;
            client.data.tenantId = tenantId;
            await client.join(`user:${userId}`);
            await client.join(`tenant:${tenantId}`);
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId).add(client.id);
            this.logger.log(`Client ${client.id} connected → user:${userId}, tenant:${tenantId}`);
        }
        catch (err) {
            this.logger.error(`Connection error: ${err.message}`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        const userId = client.data?.userId;
        if (userId && this.userSockets.has(userId)) {
            this.userSockets.get(userId).delete(client.id);
            if (this.userSockets.get(userId).size === 0) {
                this.userSockets.delete(userId);
            }
        }
        this.logger.log(`Client ${client.id} disconnected`);
    }
    sendToUser(userId, notification) {
        this.server.to(`user:${userId}`).emit('notification', notification);
        this.logger.debug(`Pushed notification to user:${userId}`);
    }
    broadcastToTenant(tenantId, notification) {
        this.server.to(`tenant:${tenantId}`).emit('notification', notification);
        this.logger.debug(`Broadcast notification to tenant:${tenantId}`);
    }
    sendUnreadCount(userId, count) {
        this.server.to(`user:${userId}`).emit('notification_count', { unread: count });
    }
    handleMarkRead(client, data) {
        client.emit('marked_read', { id: data.notificationId });
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleMarkRead", null);
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
        namespace: '/notifications',
    })
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map