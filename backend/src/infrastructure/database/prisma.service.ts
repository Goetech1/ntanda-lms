import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // We explicitly create the extended client
  public readonly client;

  constructor(
    @Inject('TENANT_STORAGE') private readonly tenantStorage: AsyncLocalStorage<string>,
  ) {
    super();

    // Extend Prisma to automatically inject the tenant_id on operations for models that require it
    // Note: We're doing a simplified runtime extension. In production, you'd target specific models.
    this.client = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const tenantId = tenantStorage.getStore();
            
            // Models that don't have tenantId (e.g., Tenant model itself) should be skipped
            // Permission is global, RefreshToken is scoped by userId
            const tenantAgnosticModels = ['Tenant', 'Permission', 'RefreshToken'];
            
            if (tenantId && !tenantAgnosticModels.includes(model)) {
              if (model === 'Role') {
                if (['findFirst', 'findMany', 'count'].includes(operation)) {
                  (args as any).where = {
                    ...(args as any).where,
                    OR: [
                      { tenantId },
                      { isSystem: true, tenantId: null },
                    ],
                  };
                } else if (['update', 'updateMany', 'delete', 'deleteMany'].includes(operation)) {
                  (args as any).where = { ...(args as any).where, tenantId };
                } else if (['create', 'createMany'].includes(operation)) {
                  if (Array.isArray((args as any).data)) {
                    (args as any).data = (args as any).data.map((d: Record<string, unknown>) => ({ ...d, tenantId }));
                  } else {
                    (args as any).data = { ...(args as any).data, tenantId };
                  }
                }
              } else {
                // Convert findUnique to findFirst to allow adding the tenantId filter without throwing Prisma errors
                if (operation === 'findUnique') {
                  operation = 'findFirst';
                }
                
                if (['findFirst', 'findMany', 'update', 'updateMany', 'delete', 'deleteMany', 'count'].includes(operation)) {
                  (args as any).where = { ...(args as any).where, tenantId };
                }
                
                if (['create', 'createMany'].includes(operation)) {
                  if (Array.isArray((args as any).data)) {
                    (args as any).data = (args as any).data.map((d: Record<string, unknown>) => ({ ...d, tenantId }));
                  } else {
                    (args as any).data = { ...(args as any).data, tenantId };
                  }
                }
              }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return query(args);
          },
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
