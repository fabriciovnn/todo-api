import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
