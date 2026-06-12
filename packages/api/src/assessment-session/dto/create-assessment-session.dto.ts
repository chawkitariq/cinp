import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { SessionStatus } from '../entities/assessment-session.entity';

/**
 * Request contract for creating an invited candidate assessment session.
 */
export class CreateAssessmentSessionDto {
  /**
   * Unique invitation token used by the candidate-facing session URL.
   */
  @IsString()
  token: string;

  /**
   * Email address of the invited candidate.
   */
  @IsEmail()
  candidateEmail: string;

  @IsOptional()
  @IsString()
  candidateName?: string;

  @IsUUID()
  assessmentId: string;

  /**
   * Optional initial lifecycle state; defaults to invited when omitted.
   */
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  /**
   * ISO date string marking when the timed session started.
   */
  @IsOptional()
  @IsDateString()
  startedAt?: string;

  /**
   * ISO date string defining the candidate submission deadline.
   */
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  /**
   * ISO date string marking when the candidate finished the session.
   */
  @IsOptional()
  @IsDateString()
  finishedAt?: string;

  /**
   * Aggregated session score, defaulting to zero for new invitations.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  totalScore?: number;
}
