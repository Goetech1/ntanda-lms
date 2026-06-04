"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
let SubscriptionsService = class SubscriptionsService {
    async createSubscription(tenantId, planName) {
        const existing = await prisma.subscription.findFirst({
            where: { tenantId, status: 'ACTIVE' }
        });
        if (existing) {
            throw new common_1.BadRequestException('Tenant already has an active subscription');
        }
        const stripeSubscriptionId = `mock_sub_${(0, crypto_1.randomBytes)(12).toString('hex')}`;
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
        return prisma.subscription.create({
            data: {
                tenantId,
                planName,
                stripeSubscriptionId,
                status: 'ACTIVE',
                currentPeriodEnd
            }
        });
    }
    async getSubscription(tenantId) {
        return prisma.subscription.findFirst({
            where: { tenantId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async cancelSubscription(tenantId, subscriptionId) {
        return prisma.subscription.update({
            where: { id: subscriptionId, tenantId },
            data: { status: 'CANCELED' }
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)()
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map