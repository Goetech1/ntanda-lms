import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    createSubscription(req: any, planName: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planName: string;
        stripeSubscriptionId: string;
        currentPeriodEnd: Date;
    }>;
    getSubscription(req: any): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planName: string;
        stripeSubscriptionId: string;
        currentPeriodEnd: Date;
    }>;
    cancelSubscription(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planName: string;
        stripeSubscriptionId: string;
        currentPeriodEnd: Date;
    }>;
}
