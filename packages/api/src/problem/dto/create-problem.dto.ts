import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Difficulty } from '../enums/difficulty.enum';
import { CreateTestCaseDto } from './create-test-case.dto';

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

  /**
   * Optional validation cases created together with the problem.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestCaseDto)
  testCases?: CreateTestCaseDto[];
}
