import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Difficulty } from '../entities/problem.entity';

export class CreateProblemDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  examples?: Record<string, unknown>[];

  @IsOptional()
  @IsString()
  constraints?: string;

  @IsOptional()
  @IsString()
  starterCode?: string;

  @IsUUID()
  createdById: string;
}
