import { CourseCategoriesService } from './course-categories.service';
export declare class CourseCategoriesController {
    private readonly service;
    constructor(service: CourseCategoriesService);
    create(dto: any, tenantId: string): Promise<any>;
    findAll(tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, dto: any, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<any>;
}
