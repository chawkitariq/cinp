import { PartialType } from '@nestjs/mapped-types';
import { CreateAssessmentDto } from './create-assessment.dto';

/**
 * Partial request contract for updating an existing assessment.
 */
export class UpdateAssessmentDto extends PartialType(CreateAssessmentDto) {}
