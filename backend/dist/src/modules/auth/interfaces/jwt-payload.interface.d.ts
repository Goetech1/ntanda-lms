export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    permissions: string[];
    tenant_id: string | null;
    iat?: number;
    exp?: number;
}
export interface AuthenticatedUser {
    id: string;
    email: string;
    role: string;
    permissions: string[];
    tenantId: string | null;
}
