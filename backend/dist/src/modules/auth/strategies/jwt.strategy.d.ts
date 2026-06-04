import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { Request } from 'express';
import { JwtPayload, AuthenticatedUser } from '../interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(req: Request, payload: JwtPayload): Promise<AuthenticatedUser>;
}
export {};
