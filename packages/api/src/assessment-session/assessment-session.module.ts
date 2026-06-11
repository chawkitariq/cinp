import { Module } from '@nestjs/common';
import { AssessmentSessionService } from './assessment-session.service';
import { AssessmentSessionController } from './assessment-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentSession } from './entities/assessment-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentSession])],
  controllers: [AssessmentSessionController],
  providers: [AssessmentSessionService],
})
export class AssessmentSessionModule {}
