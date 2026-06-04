import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreateLessonDto {
  @IsUUID()
  @IsNotEmpty()
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;
}
