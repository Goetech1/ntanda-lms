import { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getPayments(req: any): Promise<({
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
    checkoutStripe(req: any, body: {
        courseId: string;
        amount: number;
    }): Promise<{
        sessionId: any;
        gateway: string;
        url: any;
    }>;
    checkoutPaystack(req: any, body: {
        courseId: string;
        amount: number;
    }): Promise<{
        sessionId: string;
        gateway: string;
        url: any;
    }>;
    checkoutFlutterwave(req: any, body: {
        courseId: string;
        amount: number;
    }): Promise<{
        sessionId: string;
        gateway: string;
        url: any;
    }>;
    stripeWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
    paystackWebhook(req: any, signature: string): Promise<{
        received: boolean;
    }>;
    flutterwaveWebhook(req: any, signature: string): Promise<{
        received: boolean;
    }>;
}
