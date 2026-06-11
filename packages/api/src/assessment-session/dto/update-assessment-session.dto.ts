import { PartialType } from '@nestjs/mapped-types';
import { CreateAssessmentSessionDto } from './create-assessment-session.dto';

export class UpdateAssessmentSessionDto extends PartialType(CreateAssessmentSessionDto) {}
