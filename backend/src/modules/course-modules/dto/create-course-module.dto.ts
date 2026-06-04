import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateCourseModuleDto {
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;
}
