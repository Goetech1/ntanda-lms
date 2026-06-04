import { CertificatesService } from './certificates.service';
export declare class CertificatesController {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    getCertificates(req: any): Promise<({
        course: {
            id: string;
            description: string;
            createdAt: Date;
            tenantId: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CourseStatus;
            deletedAt: Date | null;
            instructorId: string;
            title: string;
            thumbnailUrl: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            categoryId: string | null;
            version: number;
        };
    } & {
        id: string;
        tenantId: string;
        userId: string;
        courseId: string;
        issuedAt: Date;
        certificateUrl: string;
        validationCode: string;
    })[]>;
    issueCertificate(req: any, body: {
        courseId: string;
    }): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        courseId: string;
        issuedAt: Date;
        certificateUrl: string;
        validationCode: string;
    }>;
    verifyCertificate(code: string): Promise<{
        tenant: {
            name: string;
            branding: import("@prisma/client/runtime/library").JsonValue;
        };
        user: {
            email: string;
            fullName: string;
        };
        course: {
            description: string;
            title: string;
        };
    } & {
        id: string;
        tenantId: string;
        userId: string;
        courseId: string;
        issuedAt: Date;
        certificateUrl: string;
        validationCode: string;
    }>;
    getCertificatePdf(id: string): Promise<{
        success: boolean;
        message: string;
        url: string;
    }>;
}
