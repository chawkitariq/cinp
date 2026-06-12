import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { AssessmentStatus } from '../entities/assessment.entity';

/**
 * Request contract for creating a recruiter-owned assessment.
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

  @IsUUID()
  createdById: string;
}
