import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { SubmissionStatus } from '../entities/submission.entity';

/**
 * Request contract for recording a candidate code submission.
 */
export class CreateSubmissionDto {
  @IsUUID()
  sessionId: string;

  @IsUUID()
  problemId: string;

  @IsString()
  language: string;

  /**
   * Source code submitted by the candidate.
   */
  @IsString()
  code: string;

  /**
   * Optional initial execution status; defaults to pending when omitted.
   */
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  /**
   * Number of validation test cases passed.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  passedTests?: number;

  /**
   * Number of validation test cases executed.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  totalTests?: number;

  /**
   * Execution runtime in milliseconds.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  runtimeMs?: number;
}
