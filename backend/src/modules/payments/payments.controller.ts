import { Controller, Get, Post, Body, UseGuards, Req, Headers, RawBodyRequest, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getPayments(@Req() req: any) {
    return this.paymentsService.getPayments(req.tenantId, req.user.id, req.user.role);
  }

  @Post('stripe/checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async checkoutStripe(@Req() req: any, @Body() body: { courseId: string; amount: number }) {
    return this.paymentsService.checkoutStripe(req.tenantId, req.user.id, body.courseId, body.amount);
  }

  @Post('paystack/checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async checkoutPaystack(@Req() req: any, @Body() body: { courseId: string; amount: number }) {
    return this.paymentsService.checkoutPaystack(req.tenantId, req.user.id, body.courseId, body.amount);
  }

  @Post('flutterwave/checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async checkoutFlutterwave(@Req() req: any, @Body() body: { courseId: string; amount: number }) {
    return this.paymentsService.checkoutFlutterwave(req.tenantId, req.user.id, body.courseId, body.amount);
  }

  // ─── Webhooks (Unauthenticated) ─────────────────────────────────────────────

  @Post('webhook/stripe')
  async stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    if (!signature) {
      throw new HttpException('Missing stripe-signature header', HttpStatus.BAD_REQUEST);
    }
    // We pass the raw body buffer and the signature to the service
    return this.paymentsService.handleStripeWebhook(req.rawBody, signature);
  }

  @Post('webhook/paystack')
  async paystackWebhook(@Req() req: any, @Headers('x-paystack-signature') signature: string) {
    if (!signature) {
      throw new HttpException('Missing x-paystack-signature header', HttpStatus.BAD_REQUEST);
    }
    return this.paymentsService.handlePaystackWebhook(req.body, signature);
  }

  @Post('webhook/flutterwave')
  async flutterwaveWebhook(@Req() req: any, @Headers('verif-hash') signature: string) {
    if (!signature) {
      throw new HttpException('Missing verif-hash header', HttpStatus.BAD_REQUEST);
    }
    return this.paymentsService.handleFlutterwaveWebhook(req.body, signature);
  }
}
