import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { SubmissionStatus } from '../entities/submission.entity';

export class CreateSubmissionDto {
  @IsUUID()
  sessionId: string;

  @IsUUID()
  problemId: string;

  @IsString()
  language: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  passedTests?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalTests?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  runtimeMs?: number;
}
