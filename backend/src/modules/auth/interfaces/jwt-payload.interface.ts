
/**
 * Shape of the JWT payload stored in the Access Token.
 * As per AUTHENTICATION.md
 */
export interface JwtPayload {
  /** User UUID */
  sub: string;
  email: string;
  role: string;
  permissions: string[];
  tenant_id: string | null;
  iat?: number;
  exp?: number;
}

/**
 * The request user object injected by JwtStrategy.validate()
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  tenantId: string | null;
}
