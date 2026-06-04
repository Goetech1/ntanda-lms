import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
export declare const tenantStorage: AsyncLocalStorage<string>;
export declare class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}
