import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, tenantId: string, res: Response): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            user: {
                id: any;
                role: any;
                full_name: any;
            };
        };
    }>;
    register(registerDto: RegisterDto, tenantId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: any;
                email: any;
                role: any;
            };
        };
    }>;
    refresh(req: Request, res: Response): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
        };
    }>;
    logout(req: any, res: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    googleLogin(data: any, tenantId: string): Promise<{
        success: boolean;
        message: string;
        token: string;
    }>;
    microsoftLogin(data: any, tenantId: string): Promise<{
        success: boolean;
        message: string;
        token: string;
    }>;
    enable2FA(req: any): Promise<{
        success: boolean;
        message: string;
        secret: string;
    }>;
    getDevices(req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
        }[];
    }>;
}
