import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Difficulty } from '../entities/problem.entity';

/**
 * Request contract for creating a technical problem.
 */
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

  /**
   * Optional human-readable limits or rules shown with the problem.
   */
  @IsOptional()
  @IsString()
  constraints?: string;

  /**
   * Optional starter code prefilled in the candidate editor.
   */
  @IsOptional()
  @IsString()
  starterCode?: string;

  @IsUUID()
  createdById: string;
}
