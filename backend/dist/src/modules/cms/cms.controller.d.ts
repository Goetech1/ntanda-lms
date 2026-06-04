import { CmsService } from './cms.service';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    getPages(req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
        }[];
    }>;
    createBlog(req: any, data: any): Promise<{
        success: boolean;
        data: any;
    }>;
    captureLead(req: any, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
