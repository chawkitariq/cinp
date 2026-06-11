import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentProblem } from './entities/assessment-problem.entity';
import { Assessment } from './entities/assessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment, AssessmentProblem])],
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
export class AssessmentModule {}
