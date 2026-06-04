import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AsyncLocalStorage } from 'async_hooks';
export declare class TenantGuard implements CanActivate {
    private reflector;
    private tenantStorage;
    constructor(reflector: Reflector, tenantStorage: AsyncLocalStorage<string | undefined>);
    canActivate(context: ExecutionContext): boolean;
}
