import { Module } from '@nestjs/common';
import { AssessmentSessionService } from './assessment-session.service';
import { AssessmentSessionController } from './assessment-session.controller';

@Module({
  controllers: [AssessmentSessionController],
  providers: [AssessmentSessionService],
})
export class AssessmentSessionModule {}
