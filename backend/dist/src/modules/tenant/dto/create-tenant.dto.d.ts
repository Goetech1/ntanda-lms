import { TenantStatus } from '@prisma/client';
export declare class CreateTenantDto {
    name: string;
    domain: string;
    subdomain: string;
    status?: TenantStatus;
    branding?: Record<string, any>;
}
