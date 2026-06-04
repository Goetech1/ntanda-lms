import { CourseStatus } from '@prisma/client';
export declare class CreateCourseDto {
    title: string;
    description: string;
    price: number;
    thumbnailUrl?: string;
    status?: CourseStatus;
}
