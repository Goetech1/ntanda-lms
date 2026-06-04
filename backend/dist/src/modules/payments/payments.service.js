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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const Stripe = require('stripe');
const crypto = require("crypto");
const prisma = new client_1.PrismaClient();
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor() {
        this.logger = new common_1.Logger(PaymentsService_1.name);
        this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2025-01-27.acacia',
        });
    }
    async getPayments(tenantId, userId, role) {
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            return prisma.payment.findMany({
                where: { tenantId },
                include: { course: true, user: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        return prisma.payment.findMany({
            where: { tenantId, userId },
            include: { course: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async checkoutStripe(tenantId, userId, courseId, amount) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new common_1.BadRequestException('Stripe is not configured');
        }
        const { course, user } = await this.validateCheckout(tenantId, userId, courseId);
        const reference = `stripe_${crypto.randomBytes(12).toString('hex')}`;
        const payment = await prisma.payment.create({
            data: {
                tenantId,
                userId,
                courseId,
                amount,
                stripeSessionId: reference,
                status: 'PENDING',
            },
        });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const session = await this.stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            client_reference_id: reference,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course.title,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${frontendUrl}/student/checkout/success?session_id={CHECKOUT_SESSION_ID}&gateway=stripe`,
            cancel_url: `${frontendUrl}/student/checkout/cancel`,
            metadata: {
                tenantId,
                userId,
                courseId,
                paymentId: payment.id,
            },
        });
        await prisma.payment.update({
            where: { id: payment.id },
            data: { stripeSessionId: session.id },
        });
        return { sessionId: session.id, gateway: 'STRIPE', url: session.url };
    }
    async handleStripeWebhook(rawBody, signature) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            this.logger.error('Stripe webhook secret not configured.');
            return;
        }
        if (!rawBody) {
            throw new common_1.BadRequestException('Raw body is missing');
        }
        let event;
        try {
            event = this.stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
        }
        catch (err) {
            this.logger.error(`Stripe Webhook signature verification failed: ${err.message}`);
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            await this.processSuccessfulPayment(session.metadata?.paymentId);
        }
        return { received: true };
    }
    async checkoutPaystack(tenantId, userId, courseId, amount) {
        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            throw new common_1.BadRequestException('Paystack is not configured');
        }
        const { user } = await this.validateCheckout(tenantId, userId, courseId);
        const reference = `ps_${crypto.randomBytes(12).toString('hex')}`;
        const payment = await prisma.payment.create({
            data: {
                tenantId,
                userId,
                courseId,
                amount,
                stripeSessionId: reference,
                status: 'PENDING',
            },
        });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        try {
            const response = await fetch('https://api.paystack.co/transaction/initialize', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    amount: amount * 100,
                    reference: reference,
                    callback_url: `${frontendUrl}/student/checkout/success?session_id=${reference}&gateway=paystack`,
                    metadata: {
                        tenantId,
                        userId,
                        courseId,
                        paymentId: payment.id,
                    },
                }),
            });
            const data = await response.json();
            if (!data.status) {
                throw new Error(data.message || 'Paystack initialization failed');
            }
            return { sessionId: reference, gateway: 'PAYSTACK', url: data.data.authorization_url };
        }
        catch (error) {
            this.logger.error(`Paystack checkout failed: ${error.message}`);
            throw new common_1.BadRequestException('Payment gateway error');
        }
    }
    async handlePaystackWebhook(body, signature) {
        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            return;
        }
        const hash = crypto.createHmac('sha512', secretKey).update(JSON.stringify(body)).digest('hex');
        if (hash !== signature) {
            this.logger.error('Paystack webhook signature verification failed.');
            throw new common_1.BadRequestException('Invalid signature');
        }
        if (body.event === 'charge.success') {
            const reference = body.data.reference;
            const payment = await prisma.payment.findUnique({
                where: { stripeSessionId: reference },
            });
            if (payment) {
                await this.processSuccessfulPayment(payment.id);
            }
        }
        return { received: true };
    }
    async checkoutFlutterwave(tenantId, userId, courseId, amount) {
        const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
        if (!secretKey) {
            throw new common_1.BadRequestException('Flutterwave is not configured');
        }
        const { user } = await this.validateCheckout(tenantId, userId, courseId);
        const reference = `flw_${crypto.randomBytes(12).toString('hex')}`;
        const payment = await prisma.payment.create({
            data: {
                tenantId,
                userId,
                courseId,
                amount,
                stripeSessionId: reference,
                status: 'PENDING',
            },
        });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        try {
            const response = await fetch('https://api.flutterwave.com/v3/payments', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tx_ref: reference,
                    amount: amount,
                    currency: 'NGN',
                    redirect_url: `${frontendUrl}/student/checkout/success?session_id=${reference}&gateway=flutterwave`,
                    customer: {
                        email: user.email,
                        name: user.fullName,
                    },
                    meta: {
                        tenantId,
                        userId,
                        courseId,
                        paymentId: payment.id,
                    },
                }),
            });
            const data = await response.json();
            if (data.status !== 'success') {
                throw new Error(data.message || 'Flutterwave initialization failed');
            }
            return { sessionId: reference, gateway: 'FLUTTERWAVE', url: data.data.link };
        }
        catch (error) {
            this.logger.error(`Flutterwave checkout failed: ${error.message}`);
            throw new common_1.BadRequestException('Payment gateway error');
        }
    }
    async handleFlutterwaveWebhook(body, signature) {
        const webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            return;
        }
        if (signature !== webhookSecret) {
            this.logger.error('Flutterwave webhook signature verification failed.');
            throw new common_1.BadRequestException('Invalid signature');
        }
        if (body.event === 'charge.completed' && body.data.status === 'successful') {
            const reference = body.data.tx_ref;
            const payment = await prisma.payment.findUnique({
                where: { stripeSessionId: reference },
            });
            if (payment) {
                await this.processSuccessfulPayment(payment.id);
            }
        }
        return { received: true };
    }
    async validateCheckout(tenantId, userId, courseId) {
        const course = await prisma.course.findUnique({
            where: { id: courseId, tenantId },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const user = await prisma.user.findUnique({
            where: { id: userId, tenantId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                tenantId_userId_courseId: {
                    tenantId,
                    userId,
                    courseId,
                },
            },
        });
        if (existingEnrollment) {
            throw new common_1.BadRequestException('User is already enrolled in this course');
        }
        return { course, user };
    }
    async processSuccessfulPayment(paymentId) {
        if (!paymentId)
            return;
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
        });
        if (!payment || payment.status === 'COMPLETED')
            return;
        await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'COMPLETED' },
        });
        if (payment.courseId) {
            await prisma.enrollment.upsert({
                where: {
                    tenantId_userId_courseId: {
                        tenantId: payment.tenantId,
                        userId: payment.userId,
                        courseId: payment.courseId,
                    },
                },
                update: {},
                create: {
                    tenantId: payment.tenantId,
                    userId: payment.userId,
                    courseId: payment.courseId,
                    progressPercentage: 0,
                },
            });
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map