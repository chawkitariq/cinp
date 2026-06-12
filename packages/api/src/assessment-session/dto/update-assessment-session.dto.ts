import { PartialType } from '@nestjs/mapped-types';
import { CreateAssessmentSessionDto } from './create-assessment-session.dto';

/**
 * Partial request contract for changing candidate session metadata or status.
 */
export class UpdateAssessmentSessionDto extends PartialType(
  CreateAssessmentSessionDto,
) {}
