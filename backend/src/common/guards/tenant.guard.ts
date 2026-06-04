import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_TENANT_KEY } from '../decorators/require-tenant.decorator';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('TENANT_STORAGE')
    private tenantStorage: AsyncLocalStorage<string | undefined>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiresTenant = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_TENANT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiresTenant) {
      return true;
    }

    const tenantId = this.tenantStorage.getStore();

    if (!tenantId) {
      throw new UnauthorizedException(
        'Tenant context is required for this operation. Please provide a valid x-tenant-id header.',
      );
    }

    return true;
  }
}
