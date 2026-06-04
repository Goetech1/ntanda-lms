export declare class CmsService {
    getPages(tenantId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
        }[];
    }>;
    createBlog(tenantId: string, blogData: any): Promise<{
        success: boolean;
        data: any;
    }>;
    captureLead(tenantId: string, leadData: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
