import { VirtualClassroomService } from './virtual-classroom.service';
export declare class VirtualClassroomController {
    private readonly virtualClassroomService;
    constructor(virtualClassroomService: VirtualClassroomService);
    scheduleClass(req: any, data: any): Promise<any>;
    listClasses(req: any): Promise<any>;
    register(id: string, req: any, data: any): Promise<any>;
}
