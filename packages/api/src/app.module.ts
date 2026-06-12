import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ProblemModule } from './problem/problem.module';
import { AssessmentModule } from './assessment/assessment.module';
import { AssessmentSessionModule } from './assessment-session/assessment-session.module';
import { SubmissionModule } from './submission/submission.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ProblemModule,
    AssessmentModule,
    AssessmentSessionModule,
    SubmissionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
/**
 * Root NestJS module composing infrastructure and domain modules.
 */
export class AppModule {}
