export declare class PaymentsService {
    private readonly logger;
    private stripeClient;
    constructor();
    getPayments(tenantId: string, userId: string, role: string): Promise<({
        course: {
            id: string;
            description: string;
            createdAt: Date;
            tenantId: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CourseStatus;
            deletedAt: Date | null;
            instructorId: string;
            title: string;
            thumbnailUrl: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            categoryId: string | null;
            version: number;
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        userId: string;
        courseId: string | null;
        stripeSessionId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    })[]>;
    checkoutStripe(tenantId: string, userId: string, courseId: string, amount: number): Promise<{
        sessionId: any;
        gateway: string;
        url: any;
    }>;
    handleStripeWebhook(rawBody: Buffer | undefined, signature: string): Promise<{
        received: boolean;
    }>;
    checkoutPaystack(tenantId: string, userId: string, courseId: string, amount: number): Promise<{
        sessionId: string;
        gateway: string;
        url: any;
    }>;
    handlePaystackWebhook(body: any, signature: string): Promise<{
        received: boolean;
    }>;
    checkoutFlutterwave(tenantId: string, userId: string, courseId: string, amount: number): Promise<{
        sessionId: string;
        gateway: string;
        url: any;
    }>;
    handleFlutterwaveWebhook(body: any, signature: string): Promise<{
        received: boolean;
    }>;
    private validateCheckout;
    private processSuccessfulPayment;
}
