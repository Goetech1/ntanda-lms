import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantStorage } from '../../app.module';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'];

    // If there's a tenantId, we run the request inside the AsyncLocalStorage context.
    // If there isn't, we still run it, but with undefined.
    // The TenantGuard will be responsible for enforcing whether a route REQUIRES a tenant or not.
    tenantStorage.run(tenantId as string | undefined, () => {
      next();
    });
  }
}
