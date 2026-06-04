import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly tenantStorage;
    readonly client: any;
    constructor(tenantStorage: AsyncLocalStorage<string>);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
