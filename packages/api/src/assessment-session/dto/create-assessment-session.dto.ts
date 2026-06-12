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

export class CreateAssessmentSessionDto {
  @IsString()
  token: string;

  @IsEmail()
  candidateEmail: string;

  @IsOptional()
  @IsString()
  candidateName?: string;

  @IsUUID()
  assessmentId: string;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsDateString()
  finishedAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalScore?: number;
}
