import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

@Injectable()
export class SubscriptionsService {
  async createSubscription(tenantId: string, planName: string) {
    // Check if there is already an active subscription
    const existing = await prisma.subscription.findFirst({
      where: { tenantId, status: 'ACTIVE' }
    });

    if (existing) {
      throw new BadRequestException('Tenant already has an active subscription');
    }

    // Mock stripe subscription generation
    const stripeSubscriptionId = `mock_sub_${randomBytes(12).toString('hex')}`;
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1); // 1 month from now

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

  async getSubscription(tenantId: string) {
    return prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async cancelSubscription(tenantId: string, subscriptionId: string) {
    return prisma.subscription.update({
      where: { id: subscriptionId, tenantId },
      data: { status: 'CANCELED' }
    });
  }
}
