import {
  ArrayUnique,
  IsEnum,
  IsInt,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { AssessmentStatus } from '../enums/assessment-status.enum';

/**
 * Request contract for creating an assessment.
 */
export class CreateAssessmentDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Candidate time limit in minutes.
   */
  @IsInt()
  @Min(1)
  durationMin: number;

  /**
   * Optional initial lifecycle state; defaults to draft when omitted.
   */
  @IsOptional()
  @IsEnum(AssessmentStatus)
  status?: AssessmentStatus;

  /**
   * Ordered list of problem UUIDs included in the assessment.
   */
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  problemIds?: string[];
}
