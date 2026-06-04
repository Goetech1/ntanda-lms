import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Stripe = require('stripe');
import * as crypto from 'crypto';

const prisma = new PrismaClient();

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripeClient: any;

  constructor() {
    this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-01-27.acacia' as any, // use whatever version matches or default
    });
  }

  async getPayments(tenantId: string, userId: string, role: string) {
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

  // ─── Stripe ──────────────────────────────────────────────────────────────────

  async checkoutStripe(tenantId: string, userId: string, courseId: string, amount: number) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new BadRequestException('Stripe is not configured');
    }

    const { course, user } = await this.validateCheckout(tenantId, userId, courseId);

    // Create a generic payment record first
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
            unit_amount: amount * 100, // Stripe expects cents
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

    // Update with real Stripe session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: session.id },
    });

    return { sessionId: session.id, gateway: 'STRIPE', url: session.url };
  }

  async handleStripeWebhook(rawBody: Buffer | undefined, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      this.logger.error('Stripe webhook secret not configured.');
      return;
    }

    if (!rawBody) {
       throw new BadRequestException('Raw body is missing');
    }

    let event: any;

    try {
      event = this.stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      this.logger.error(`Stripe Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      await this.processSuccessfulPayment(session.metadata?.paymentId);
    }

    return { received: true };
  }

  // ─── Paystack ────────────────────────────────────────────────────────────────

  async checkoutPaystack(tenantId: string, userId: string, courseId: string, amount: number) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new BadRequestException('Paystack is not configured');
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
          amount: amount * 100, // Paystack expects kobo
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
    } catch (error: any) {
      this.logger.error(`Paystack checkout failed: ${error.message}`);
      throw new BadRequestException('Payment gateway error');
    }
  }

  async handlePaystackWebhook(body: any, signature: string) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
       return;
    }

    // Validate signature
    const hash = crypto.createHmac('sha512', secretKey).update(JSON.stringify(body)).digest('hex');
    if (hash !== signature) {
      this.logger.error('Paystack webhook signature verification failed.');
      throw new BadRequestException('Invalid signature');
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

  // ─── Flutterwave ─────────────────────────────────────────────────────────────

  async checkoutFlutterwave(tenantId: string, userId: string, courseId: string, amount: number) {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      throw new BadRequestException('Flutterwave is not configured');
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
          currency: 'NGN', // Assume NGN for this demo or make dynamic
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
    } catch (error: any) {
      this.logger.error(`Flutterwave checkout failed: ${error.message}`);
      throw new BadRequestException('Payment gateway error');
    }
  }

  async handleFlutterwaveWebhook(body: any, signature: string) {
    const webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return;
    }

    // Validate signature
    if (signature !== webhookSecret) {
      this.logger.error('Flutterwave webhook signature verification failed.');
      throw new BadRequestException('Invalid signature');
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

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async validateCheckout(tenantId: string, userId: string, courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId, tenantId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already enrolled
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
      throw new BadRequestException('User is already enrolled in this course');
    }

    return { course, user };
  }

  private async processSuccessfulPayment(paymentId: string | undefined) {
    if (!paymentId) return;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || payment.status === 'COMPLETED') return;

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
}
