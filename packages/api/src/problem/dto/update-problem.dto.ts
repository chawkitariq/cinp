import { PartialType } from '@nestjs/mapped-types';
import { CreateProblemDto } from './create-problem.dto';

/**
 * Partial request contract for updating an existing problem.
 */
export class UpdateProblemDto extends PartialType(CreateProblemDto) {}
