export declare class SubscriptionsService {
    createSubscription(tenantId: string, planName: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planName: string;
        stripeSubscriptionId: string;
        currentPeriodEnd: Date;
    }>;
    getSubscription(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planName: string;
        stripeSubscriptionId: string;
        currentPeriodEnd: Date;
    }>;
    cancelSubscription(tenantId: string, subscriptionId: string): Promise<{
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
