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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async getPayments(req) {
        return this.paymentsService.getPayments(req.tenantId, req.user.id, req.user.role);
    }
    async checkoutStripe(req, body) {
        return this.paymentsService.checkoutStripe(req.tenantId, req.user.id, body.courseId, body.amount);
    }
    async checkoutPaystack(req, body) {
        return this.paymentsService.checkoutPaystack(req.tenantId, req.user.id, body.courseId, body.amount);
    }
    async checkoutFlutterwave(req, body) {
        return this.paymentsService.checkoutFlutterwave(req.tenantId, req.user.id, body.courseId, body.amount);
    }
    async stripeWebhook(req, signature) {
        if (!signature) {
            throw new common_1.HttpException('Missing stripe-signature header', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.paymentsService.handleStripeWebhook(req.rawBody, signature);
    }
    async paystackWebhook(req, signature) {
        if (!signature) {
            throw new common_1.HttpException('Missing x-paystack-signature header', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.paymentsService.handlePaystackWebhook(req.body, signature);
    }
    async flutterwaveWebhook(req, signature) {
        if (!signature) {
            throw new common_1.HttpException('Missing verif-hash header', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.paymentsService.handleFlutterwaveWebhook(req.body, signature);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Post)('stripe/checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "checkoutStripe", null);
__decorate([
    (0, common_1.Post)('paystack/checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "checkoutPaystack", null);
__decorate([
    (0, common_1.Post)('flutterwave/checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "checkoutFlutterwave", null);
__decorate([
    (0, common_1.Post)('webhook/stripe'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "stripeWebhook", null);
__decorate([
    (0, common_1.Post)('webhook/paystack'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-paystack-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "paystackWebhook", null);
__decorate([
    (0, common_1.Post)('webhook/flutterwave'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('verif-hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "flutterwaveWebhook", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('v1/payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map