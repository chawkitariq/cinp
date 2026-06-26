import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsObject,
  IsString,
} from 'class-validator';

/**
 * Request contract for creating a validation test case under a problem.
 */
export class CreateTestCaseDto {
  @IsDefined()
  @IsObject()
  input: Record<string, unknown>;

  @IsDefined()
  expectedOutput: unknown;

  /**
   * Marks the test case as visible to the candidate.
   */
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  /**
   * Optional explanation shown when the case is public.
   */
  @IsOptional()
  @IsString()
  explanation?: string;
}
