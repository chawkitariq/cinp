import { PartialType } from '@nestjs/mapped-types';
import { CreateSubmissionDto } from './create-submission.dto';

/**
 * Partial request contract for updating submission status or scoring data.
 */
export class UpdateSubmissionDto extends PartialType(CreateSubmissionDto) {}
