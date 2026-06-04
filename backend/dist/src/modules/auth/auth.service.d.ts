import { PrismaService } from '../../infrastructure/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto, tenantId: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            role: any;
            full_name: any;
        };
    }>;
    register(registerDto: RegisterDto, tenantId: string): Promise<{
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    refreshWithUserId(userId: string, incomingToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string, refreshToken?: string): Promise<void>;
    ssoLogin(provider: string, data: any, tenantId: string): Promise<{
        success: boolean;
        message: string;
        token: string;
    }>;
    enable2FA(userId: string): Promise<{
        success: boolean;
        message: string;
        secret: string;
    }>;
    getDevices(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
        }[];
    }>;
}
