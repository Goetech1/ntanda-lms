import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('v1/subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  async createSubscription(@Req() req: any, @Body('planName') planName: string) {
    return this.subscriptionsService.createSubscription(req.tenantId, planName);
  }

  @Get()
  async getSubscription(@Req() req: any) {
    return this.subscriptionsService.getSubscription(req.tenantId);
  }

  @Patch(':id/cancel')
  async cancelSubscription(@Req() req: any, @Param('id') id: string) {
    return this.subscriptionsService.cancelSubscription(req.tenantId, id);
  }
}
