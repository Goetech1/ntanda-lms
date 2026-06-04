import { LibraryService } from './library.service';
export declare class LibraryController {
    private readonly libraryService;
    constructor(libraryService: LibraryService);
    getEbooks(req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
        }[];
    }>;
    borrowItem(req: any, data: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
