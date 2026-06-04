export declare class LibraryService {
    getEbooks(tenantId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
        }[];
    }>;
    borrowItem(tenantId: string, userId: string, data: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
