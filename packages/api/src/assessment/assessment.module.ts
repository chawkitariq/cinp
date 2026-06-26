import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentProblem } from './entities/assessment-problem.entity';
import { Assessment } from './entities/assessment.entity';
import { Problem } from 'src/problem/entities/problem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment, AssessmentProblem, Problem])],
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
/**
 * NestJS domain module for assessments and ordered problem membership.
 */
export class AssessmentModule {}
