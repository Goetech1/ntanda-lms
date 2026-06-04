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
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const require_tenant_decorator_1 = require("../decorators/require-tenant.decorator");
const async_hooks_1 = require("async_hooks");
let TenantGuard = class TenantGuard {
    constructor(reflector, tenantStorage) {
        this.reflector = reflector;
        this.tenantStorage = tenantStorage;
    }
    canActivate(context) {
        const requiresTenant = this.reflector.getAllAndOverride(require_tenant_decorator_1.REQUIRE_TENANT_KEY, [context.getHandler(), context.getClass()]);
        if (!requiresTenant) {
            return true;
        }
        const tenantId = this.tenantStorage.getStore();
        if (!tenantId) {
            throw new common_1.UnauthorizedException('Tenant context is required for this operation. Please provide a valid x-tenant-id header.');
        }
        return true;
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('TENANT_STORAGE')),
    __metadata("design:paramtypes", [core_1.Reflector,
        async_hooks_1.AsyncLocalStorage])
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map