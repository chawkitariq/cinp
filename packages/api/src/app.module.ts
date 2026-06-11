import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ProblemModule } from './problem/problem.module';

@Module({
  imports: [DatabaseModule, UserModule, ProblemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
